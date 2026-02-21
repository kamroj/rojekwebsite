const TRANSLATE_ALLOWED_ORIGIN = process.env.TRANSLATE_ALLOWED_ORIGIN || ''
const TRANSLATE_ALLOWED_ORIGINS = process.env.TRANSLATE_ALLOWED_ORIGINS || ''
const TRANSLATE_SHARED_SECRET = process.env.TRANSLATE_SHARED_SECRET || ''
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || ''
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || ''

const MAX_TEXT_LENGTH = 12000
const translationCache = new Map()

const getAllowedOrigins = () => {
  const fromTranslateSingle = TRANSLATE_ALLOWED_ORIGIN
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  const fromTranslateList = TRANSLATE_ALLOWED_ORIGINS
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  const fromSingle = ALLOWED_ORIGIN
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  const fromList = ALLOWED_ORIGINS
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  const preferred = [...fromTranslateSingle, ...fromTranslateList]
  if (preferred.length > 0) return [...new Set(preferred)]

  return [...new Set([...fromSingle, ...fromList])]
}

const pickCorsOrigin = (requestOrigin) => {
  const configured = getAllowedOrigins()

  const matchesConfiguredOrigin = (candidate, request) => {
    if (!candidate || !request) return false
    if (candidate === request) return true

    if (candidate.includes('*')) {
      const escaped = candidate.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')
      return new RegExp(`^${escaped}$`).test(request)
    }

    return false
  }

  if (configured.length === 0) return '*'
  if (configured.includes('*')) return '*'

  if (requestOrigin) {
    const matched = configured.find((candidate) => matchesConfiguredOrigin(candidate, requestOrigin))
    if (matched) return requestOrigin
  }

  return configured[0]
}

const getCorsHeaders = (requestOrigin) => ({
  'Access-Control-Allow-Origin': pickCorsOrigin(requestOrigin),
  'Access-Control-Allow-Headers': 'Content-Type, x-translate-secret',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
})

const emptyTranslations = () => ({en: '', de: '', fr: ''})

const normalizeText = (value) => {
  if (typeof value !== 'string') return ''
  return value.trim()
}

const buildSystemPrompt = () => `You are a professional translator specializing in wooden windows, doors, sliding systems (HS), wood-aluminium joinery, and fire-rated joinery (EI30, EI60).

Rules:

- Translate accurately
- Preserve technical meaning
- Preserve numbers, parameters, and units (mm, Uw, EI30, EI60)
- Preserve formatting (HTML, Markdown)
- Do not translate URLs
- Do not add explanations
- Return only JSON`

const buildUserPrompt = (text) => `Translate from Polish to English, German, and French.

Text:

"""
${text}
"""

Return JSON:

{
  "en": "...",
  "de": "...",
  "fr": "..."
}`

const tryParseTranslations = (rawOutput) => {
  if (typeof rawOutput !== 'string' || !rawOutput.trim()) return null

  const trimmed = rawOutput.trim()
  const withoutCodeFence = trimmed
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim()

  const firstBrace = withoutCodeFence.indexOf('{')
  const lastBrace = withoutCodeFence.lastIndexOf('}')
  const jsonCandidate =
    firstBrace >= 0 && lastBrace > firstBrace
      ? withoutCodeFence.slice(firstBrace, lastBrace + 1)
      : withoutCodeFence

  try {
    const parsed = JSON.parse(jsonCandidate)
    return {
      en: typeof parsed?.en === 'string' ? parsed.en : '',
      de: typeof parsed?.de === 'string' ? parsed.de : '',
      fr: typeof parsed?.fr === 'string' ? parsed.fr : '',
    }
  } catch {
    return null
  }
}

const extractOutputText = (payload) => {
  if (!payload || typeof payload !== 'object') return ''

  if (typeof payload.output_text === 'string') return payload.output_text

  const output = Array.isArray(payload.output) ? payload.output : []
  const chunks = []

  for (const item of output) {
    const content = Array.isArray(item?.content) ? item.content : []
    for (const part of content) {
      if (typeof part?.text === 'string') {
        chunks.push(part.text)
      }
    }
  }

  return chunks.join('\n').trim()
}

const translateWithOpenAI = async (text) => {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('missing-openai-api-key')
  }

  const model = process.env.OPENAI_MODEL || 'gpt-5-mini'

  const basePayload = {
    model,
    input: [
      {role: 'system', content: [{type: 'input_text', text: buildSystemPrompt()}]},
      {role: 'user', content: [{type: 'input_text', text: buildUserPrompt(text)}]},
    ],
  }

  const payloadWithSchema = {
    ...basePayload,
    text: {
      format: {
        type: 'json_schema',
        name: 'translation_payload',
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            en: {type: 'string'},
            de: {type: 'string'},
            fr: {type: 'string'},
          },
          required: ['en', 'de', 'fr'],
        },
      },
    },
  }

  const requestOpenAI = (payload) =>
    fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

  let response = await requestOpenAI(payloadWithSchema)

  if (!response.ok) {
    const firstDetail = await response.text().catch(() => '')
    const maybeUnsupportedSchema =
      response.status === 400 &&
      (firstDetail.includes('text.format') ||
        firstDetail.includes('json_schema') ||
        firstDetail.includes('unsupported_parameter'))

    if (maybeUnsupportedSchema) {
      response = await requestOpenAI(basePayload)
    } else {
      throw new Error(`openai-error:${response.status}:${firstDetail}`)
    }
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`openai-error:${response.status}:${detail}`)
  }

  const payload = await response.json()
  const outputText = extractOutputText(payload)
  const parsed = tryParseTranslations(outputText)

  if (!parsed) {
    throw new Error('invalid-translation-json')
  }

  return parsed
}

exports.handler = async (event) => {
  const requestOrigin = event?.headers?.origin || event?.headers?.Origin || ''
  const corsHeaders = getCorsHeaders(requestOrigin)
  const requestSecret =
    event?.headers?.['x-translate-secret'] ||
    event?.headers?.['X-Translate-Secret'] ||
    event?.headers?.['x-Translate-Secret'] ||
    ''

  if (event.httpMethod === 'OPTIONS') {
    return {statusCode: 200, headers: corsHeaders}
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({error: 'method-not-allowed'}),
    }
  }

  if (TRANSLATE_SHARED_SECRET && requestSecret !== TRANSLATE_SHARED_SECRET) {
    return {
      statusCode: 401,
      headers: {...corsHeaders, 'Content-Type': 'application/json'},
      body: JSON.stringify({error: 'unauthorized'}),
    }
  }

  let body
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({error: 'invalid-json'}),
    }
  }

  const text = normalizeText(body?.text)

  if (!text) {
    return {
      statusCode: 200,
      headers: {...corsHeaders, 'Content-Type': 'application/json'},
      body: JSON.stringify(emptyTranslations()),
    }
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({error: 'text-too-long', maxLength: MAX_TEXT_LENGTH}),
    }
  }

  const cached = translationCache.get(text)
  if (cached) {
    return {
      statusCode: 200,
      headers: {...corsHeaders, 'Content-Type': 'application/json'},
      body: JSON.stringify(cached),
    }
  }

  try {
    const translated = await translateWithOpenAI(text)
    translationCache.set(text, translated)

    return {
      statusCode: 200,
      headers: {...corsHeaders, 'Content-Type': 'application/json'},
      body: JSON.stringify(translated),
    }
  } catch (error) {
    console.error('Translate function error:', error)

    const detail =
      process.env.NODE_ENV === 'development'
        ? String(error?.message || error)
        : undefined

    return {
      statusCode: 500,
      headers: {...corsHeaders, 'Content-Type': 'application/json'},
      body: JSON.stringify({error: 'translation-failed', detail}),
    }
  }
}