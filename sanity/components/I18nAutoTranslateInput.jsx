import {useEffect, useMemo, useState} from 'react'
import {Button, Card, Flex, Stack, Text} from '@sanity/ui'
import {set} from 'sanity'

const EMPTY_TRANSLATIONS = {en: '', de: '', fr: ''}
const TRANSLATE_ENDPOINT = import.meta.env?.SANITY_STUDIO_TRANSLATE_ENDPOINT
const TRANSLATE_SECRET = import.meta.env?.SANITY_STUDIO_TRANSLATE_SECRET

const getTranslateEndpoints = () => {
  const candidates = [
    TRANSLATE_ENDPOINT,
    '/.netlify/functions/translate',
    'http://localhost:8888/.netlify/functions/translate',
  ].filter(Boolean)

  return [...new Set(candidates)]
}

const isStringValue = (value) => typeof value === 'string'
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

const hasMissingPortableKeys = (blocks) => {
  if (!Array.isArray(blocks)) return false

  return blocks.some((block) => {
    if (!block?._key) return true

    if (Array.isArray(block.children) && block.children.some((child) => !child?._key)) {
      return true
    }

    if (Array.isArray(block.markDefs) && block.markDefs.some((markDef) => !markDef?._key)) {
      return true
    }

    return false
  })
}

const pickTranslations = (payload) => ({
  en: typeof payload?.en === 'string' ? payload.en : '',
  de: typeof payload?.de === 'string' ? payload.de : '',
  fr: typeof payload?.fr === 'string' ? payload.fr : '',
})

export default function I18nAutoTranslateInput(props) {
  const {value, onChange} = props

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const isStringMode = isStringValue(value?.pl)
  const isPortableMode = isPortableBlocksValue(value?.pl)

  const plStringValue = useMemo(() => (isStringMode ? value.pl.trim() : ''), [isStringMode, value?.pl])
  const canTranslate =
    !isLoading && (isStringMode ? plStringValue.length > 0 : isPortableMode ? !isEmptyPortableBlocks(value?.pl) : false)

  useEffect(() => {
    if (!isPortableMode || !value || typeof value !== 'object') return

    const languages = ['pl', 'en', 'de', 'fr']
    const needsRepair = languages.some((lang) => hasMissingPortableKeys(value?.[lang]))

    if (!needsRepair) return

    const repaired = {
      ...value,
      pl: ensurePortableBlockKeys(Array.isArray(value?.pl) ? value.pl : []),
      en: ensurePortableBlockKeys(Array.isArray(value?.en) ? value.en : []),
      de: ensurePortableBlockKeys(Array.isArray(value?.de) ? value.de : []),
      fr: ensurePortableBlockKeys(Array.isArray(value?.fr) ? value.fr : []),
    }

    onChange(set(repaired))
  }, [isPortableMode, onChange, value])

  const requestTranslations = async (text) => {
    let lastError = null

    for (const endpoint of getTranslateEndpoints()) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(TRANSLATE_SECRET ? {'x-translate-secret': TRANSLATE_SECRET} : {}),
          },
          body: JSON.stringify({text}),
        })

        if (!response.ok) {
          const failure = await response.json().catch(() => ({}))
          const detail = failure?.detail || failure?.error || `status-${response.status}`
          lastError = new Error(`translation-request-failed [${endpoint}] ${detail}`)
          continue
        }

        return await response.json()
      } catch (requestError) {
        lastError = requestError
      }
    }

    throw lastError || new Error('translation-request-failed')
  }

  const applyTranslations = (translations, overwrite) => {
    const current = value && typeof value === 'object' ? {...value} : {}
    current.pl = typeof value?.pl === 'string' ? value.pl : ''
    current.en = typeof value?.en === 'string' ? value.en : ''
    current.de = typeof value?.de === 'string' ? value.de : ''
    current.fr = typeof value?.fr === 'string' ? value.fr : ''

    const next = {
      ...current,
      en: overwrite || !current.en?.trim() ? translations.en : current.en,
      de: overwrite || !current.de?.trim() ? translations.de : current.de,
      fr: overwrite || !current.fr?.trim() ? translations.fr : current.fr,
    }

    onChange(set(next))
  }

  const handleTranslate = async (overwrite = false) => {
    if (!canTranslate) return

    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      if (isStringMode) {
        const payload = await requestTranslations(plStringValue)
        const translations = pickTranslations(payload)
        applyTranslations(translations || EMPTY_TRANSLATIONS, overwrite)
      }

      if (isPortableMode) {
        const plBlocks = Array.isArray(value?.pl) ? value.pl : []
        const textNodes = extractPortableTextNodes(plBlocks)
        const uniqueTexts = [...new Set(textNodes.map((node) => node.text))]

        const translatedByText = new Map()

        await Promise.all(
          uniqueTexts.map(async (text) => {
            const payload = await requestTranslations(text)
            translatedByText.set(text, pickTranslations(payload))
          }),
        )

        const current = {
          ...(value && typeof value === 'object' ? value : {}),
          pl: ensurePortableBlockKeys(Array.isArray(value?.pl) ? value.pl : []),
          en: ensurePortableBlockKeys(Array.isArray(value?.en) ? value.en : []),
          de: ensurePortableBlockKeys(Array.isArray(value?.de) ? value.de : []),
          fr: ensurePortableBlockKeys(Array.isArray(value?.fr) ? value.fr : []),
        }

        const buildLanguageBlocks = (lang) => {
          if (!overwrite && !isEmptyPortableBlocks(current[lang])) {
            return current[lang]
          }

          const nextBlocks = cloneValue(plBlocks)

          textNodes.forEach((node) => {
            const translated = translatedByText.get(node.text)
            const text = translated?.[lang] ?? ''

            if (nextBlocks?.[node.blockIndex]?.children?.[node.childIndex]) {
              nextBlocks[node.blockIndex].children[node.childIndex].text = text
            }
          })

          return ensurePortableBlockKeys(nextBlocks)
        }

        onChange(
          set({
            ...current,
            en: buildLanguageBlocks('en'),
            de: buildLanguageBlocks('de'),
            fr: buildLanguageBlocks('fr'),
          }),
        )
      }

      setSuccessMessage(overwrite ? 'Przetłumaczono i nadpisano EN/DE/FR.' : 'Uzupełniono brakujące tłumaczenia EN/DE/FR.')
    } catch (error) {
      const extra = error?.message ? ` (${error.message})` : ''
      setErrorMessage(`Nie udało się wykonać tłumaczenia. Spróbuj ponownie.${extra}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Stack space={3}>
      {props.renderDefault(props)}

      <Card padding={2} radius={2} tone="transparent" border>
        <Stack space={2}>
          <Flex gap={2} wrap="wrap">
            <Button
              text={isLoading ? 'Tłumaczenie…' : 'Tłumacz → EN/DE/FR'}
              mode="ghost"
              tone="primary"
              disabled={!canTranslate}
              onClick={() => handleTranslate(false)}
            />
            <Button
              text={isLoading ? 'Tłumaczenie…' : 'Tłumacz (nadpisz)'}
              mode="ghost"
              tone="caution"
              disabled={!canTranslate}
              onClick={() => handleTranslate(true)}
            />
          </Flex>

          {errorMessage ? <Text size={1}>{errorMessage}</Text> : null}
          {successMessage ? <Text size={1}>{successMessage}</Text> : null}
        </Stack>
      </Card>
    </Stack>
  )
}