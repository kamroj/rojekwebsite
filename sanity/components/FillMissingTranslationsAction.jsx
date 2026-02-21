import {useMemo, useState} from 'react'
import {useClient} from 'sanity'

const TRANSLATE_ENDPOINT = import.meta.env?.SANITY_STUDIO_TRANSLATE_ENDPOINT
const TARGET_LANGUAGES = ['en', 'de', 'fr']
const SYSTEM_FIELDS = new Set(['_id', '_rev', '_createdAt', '_updatedAt'])

const getTranslateEndpoints = () => {
  const candidates = [
    TRANSLATE_ENDPOINT,
    '/.netlify/functions/translate',
    'http://localhost:8888/.netlify/functions/translate',
  ].filter(Boolean)

  return [...new Set(candidates)]
}

const isObject = (value) => Boolean(value && typeof value === 'object' && !Array.isArray(value))

const isLocalizedObject = (value) => {
  if (!isObject(value)) return false

  const hasPl = 'pl' in value
  const hasAnyTargetLanguage = ['en', 'de', 'fr'].some((key) => key in value)
  const localizedTypeHint = typeof value?._type === 'string' && value._type.toLowerCase().includes('localized')

  if (!hasPl) return false

  return hasAnyTargetLanguage || localizedTypeHint
}

const isPortableBlocksValue = (value) => Array.isArray(value)

const isEmptyPortableBlocks = (value) => {
  if (!Array.isArray(value) || value.length === 0) return true

  return !value.some(
    (block) =>
      Array.isArray(block?.children) &&
      block.children.some((child) => typeof child?.text === 'string' && child.text.trim().length > 0),
  )
}

const extractPortableTextNodes = (blocks) => {
  const nodes = []

  blocks.forEach((block, blockIndex) => {
    if (!Array.isArray(block?.children)) return

    block.children.forEach((child, childIndex) => {
      if (typeof child?.text !== 'string') return
      if (!child.text.trim()) return

      nodes.push({blockIndex, childIndex, text: child.text})
    })
  })

  return nodes
}

const cloneValue = (value) => JSON.parse(JSON.stringify(value))
const createKey = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`

const ensurePortableBlockKeys = (blocks) => {
  if (!Array.isArray(blocks)) return []

  return blocks.map((block) => {
    const nextBlock = {...block}

    if (!nextBlock._key) {
      nextBlock._key = createKey()
    }

    if (Array.isArray(nextBlock.children)) {
      nextBlock.children = nextBlock.children.map((child) => {
        const nextChild = {...child}
        if (!nextChild._key) {
          nextChild._key = createKey()
        }
        return nextChild
      })
    }

    if (Array.isArray(nextBlock.markDefs)) {
      nextBlock.markDefs = nextBlock.markDefs.map((markDef) => {
        const nextMarkDef = {...markDef}
        if (!nextMarkDef._key) {
          nextMarkDef._key = createKey()
        }
        return nextMarkDef
      })
    }

    return nextBlock
  })
}

const pickTranslations = (payload) => ({
  en: typeof payload?.en === 'string' ? payload.en : '',
  de: typeof payload?.de === 'string' ? payload.de : '',
  fr: typeof payload?.fr === 'string' ? payload.fr : '',
})

const requestTranslations = async (text, cache, onRequestCompleted) => {
  const cacheKey = `str:${text}`
  if (cache.has(cacheKey)) return cache.get(cacheKey)

  let lastError = null

  for (const endpoint of getTranslateEndpoints()) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({text}),
      })

      if (!response.ok) {
        const failure = await response.json().catch(() => ({}))
        const detail = failure?.detail || failure?.error || `status-${response.status}`
        lastError = new Error(`translation-request-failed [${endpoint}] ${detail}`)
        continue
      }

      const payload = pickTranslations(await response.json())
      cache.set(cacheKey, payload)
      if (typeof onRequestCompleted === 'function') {
        onRequestCompleted(text)
      }
      return payload
    } catch (error) {
      lastError = error
    }
  }

  throw lastError || new Error('translation-request-failed')
}

const canFillStringLocalized = (node) => {
  const pl = typeof node?.pl === 'string' ? node.pl.trim() : ''
  if (!pl) return false

  return TARGET_LANGUAGES.some((lang) => !String(node?.[lang] || '').trim())
}

const canFillPortableLocalized = (node) => {
  if (!isPortableBlocksValue(node?.pl) || isEmptyPortableBlocks(node.pl)) return false

  return TARGET_LANGUAGES.some((lang) => isEmptyPortableBlocks(node?.[lang]))
}

const hasLocalizableFields = (value) => {
  if (Array.isArray(value)) return value.some(hasLocalizableFields)
  if (!isObject(value)) return false

  if (isLocalizedObject(value)) {
    if (canFillStringLocalized(value) || canFillPortableLocalized(value)) return true
  }

  return Object.values(value).some(hasLocalizableFields)
}

const collectTranslationJobs = (value, jobs = new Set()) => {
  if (Array.isArray(value)) {
    value.forEach((item) => collectTranslationJobs(item, jobs))
    return jobs
  }

  if (!isObject(value)) return jobs

  if (isLocalizedObject(value)) {
    if (typeof value?.pl === 'string' && canFillStringLocalized(value)) {
      jobs.add(`str:${value.pl.trim()}`)
    }

    if (isPortableBlocksValue(value?.pl) && canFillPortableLocalized(value)) {
      const textNodes = extractPortableTextNodes(Array.isArray(value.pl) ? value.pl : [])
      textNodes.forEach((node) => jobs.add(`str:${node.text}`))
    }
  }

  Object.values(value).forEach((child) => collectTranslationJobs(child, jobs))
  return jobs
}

const fillLocalizedObject = async (node, cache, onRequestCompleted) => {
  if (typeof node?.pl === 'string') {
    if (!canFillStringLocalized(node)) return {value: node, changed: false, count: 0}

    const source = node.pl.trim()
    const translations = await requestTranslations(source, cache, onRequestCompleted)
    const next = {...node}
    let changed = false

    TARGET_LANGUAGES.forEach((lang) => {
      if (!String(next?.[lang] || '').trim()) {
        next[lang] = translations[lang] || ''
        changed = true
      }
    })

    return {value: changed ? next : node, changed, count: changed ? 1 : 0}
  }

  if (isPortableBlocksValue(node?.pl)) {
    if (!canFillPortableLocalized(node)) return {value: node, changed: false, count: 0}

    const sourceBlocks = ensurePortableBlockKeys(Array.isArray(node.pl) ? node.pl : [])
    const textNodes = extractPortableTextNodes(sourceBlocks)
    const uniqueTexts = [...new Set(textNodes.map((item) => item.text))]
    const translatedByText = new Map()

    await Promise.all(
      uniqueTexts.map(async (text) => {
        translatedByText.set(text, await requestTranslations(text, cache, onRequestCompleted))
      }),
    )

    const next = {
      ...node,
      pl: sourceBlocks,
      en: ensurePortableBlockKeys(Array.isArray(node?.en) ? node.en : []),
      de: ensurePortableBlockKeys(Array.isArray(node?.de) ? node.de : []),
      fr: ensurePortableBlockKeys(Array.isArray(node?.fr) ? node.fr : []),
    }

    let changed = false

    TARGET_LANGUAGES.forEach((lang) => {
      if (!isEmptyPortableBlocks(next[lang])) return

      const translatedBlocks = cloneValue(sourceBlocks)
      textNodes.forEach((entry) => {
        const translated = translatedByText.get(entry.text)
        if (translatedBlocks?.[entry.blockIndex]?.children?.[entry.childIndex]) {
          translatedBlocks[entry.blockIndex].children[entry.childIndex].text = translated?.[lang] || ''
        }
      })

      next[lang] = ensurePortableBlockKeys(translatedBlocks)
      changed = true
    })

    return {value: changed ? next : node, changed, count: changed ? 1 : 0}
  }

  return {value: node, changed: false, count: 0}
}

const fillMissingTranslationsDeep = async (value, cache, onRequestCompleted) => {
  if (Array.isArray(value)) {
    let changed = false
    let count = 0

    const next = []
    for (const item of value) {
      const result = await fillMissingTranslationsDeep(item, cache, onRequestCompleted)
      next.push(result.value)
      changed = changed || result.changed
      count += result.count
    }

    return {value: changed ? next : value, changed, count}
  }

  if (!isObject(value)) {
    return {value, changed: false, count: 0}
  }

  if (isLocalizedObject(value)) {
    return fillLocalizedObject(value, cache, onRequestCompleted)
  }

  let changed = false
  let count = 0
  const next = {...value}

  const entries = Object.entries(value)
  for (const [key, child] of entries) {
    const result = await fillMissingTranslationsDeep(child, cache, onRequestCompleted)
    if (result.changed) {
      next[key] = result.value
      changed = true
    }
    count += result.count
  }

  return {value: changed ? next : value, changed, count}
}

const toMutableDocument = (doc) => {
  const next = {}
  Object.entries(doc || {}).forEach(([key, value]) => {
    if (SYSTEM_FIELDS.has(key)) return
    next[key] = value
  })
  return next
}

export function FillMissingTranslationsAction(props) {
  const {draft, published, onComplete} = props
  const [isRunning, setIsRunning] = useState(false)
  const [lastError, setLastError] = useState('')
  const [lastCount, setLastCount] = useState(0)
  const [progressPercent, setProgressPercent] = useState(0)
  const [progressText, setProgressText] = useState('')

  const client = useClient({apiVersion: '2025-01-01'})
  const sourceDoc = draft || published

  const hasAnyCandidate = useMemo(() => hasLocalizableFields(sourceDoc), [sourceDoc])

  return {
    label: isRunning
      ? `Uzupełnianie tłumaczeń… ${progressPercent}%`
      : 'Uzupełnij brakujące tłumaczenia',
    title:
      lastError ||
      (isRunning
        ? progressText
        : lastCount > 0
        ? `Uzupełniono pól: ${lastCount}`
        : !hasAnyCandidate
          ? 'Brak brakujących tłumaczeń w tym dokumencie.'
          : ''),
    tone: lastError ? 'critical' : 'primary',
    disabled: isRunning || !sourceDoc,
    onHandle: async () => {
      if (!sourceDoc || isRunning) {
        onComplete()
        return
      }

      setIsRunning(true)
      setLastError('')
      setLastCount(0)
      setProgressPercent(0)
      setProgressText('Przygotowuję tłumaczenia…')

      try {
        const cache = new Map()
        const mutable = toMutableDocument(sourceDoc)
        const jobs = collectTranslationJobs(mutable)
        const total = jobs.size
        let done = 0

        if (total === 0) {
          setProgressPercent(100)
          setProgressText('Brak brakujących tłumaczeń do uzupełnienia.')
        }

        const onRequestCompleted = (translatedText) => {
          done += 1
          const pct = Math.min(100, Math.round((done / Math.max(total, 1)) * 100))
          setProgressPercent(pct)
          const snippet = String(translatedText || '')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 80)
          setProgressText(`Tłumaczę (${done}/${total}): ${snippet}${snippet.length === 80 ? '…' : ''}`)
        }

        const result = await fillMissingTranslationsDeep(mutable, cache, onRequestCompleted)

        if (result.changed) {
          await client.patch(sourceDoc._id).set(result.value).commit()
        }

        setLastCount(result.count)
        setProgressPercent(100)
        setProgressText(`Zakończono. Uzupełniono pól: ${result.count}`)
      } catch (error) {
        setLastError(error?.message || 'Nie udało się uzupełnić tłumaczeń.')
      } finally {
        setIsRunning(false)
        onComplete()
      }
    },
  }
}
