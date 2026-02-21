import {createClient} from '@sanity/client'

const projectId = process.env.SANITY_PROJECT_ID || '6sp9tyie'
const dataset = process.env.SANITY_DATASET || 'production'
const apiVersion = process.env.SANITY_API_VERSION || '2025-01-01'
const token = process.env.SANITY_API_TOKEN || process.env.SANITY_WRITE_TOKEN

const isDryRun = process.argv.includes('--apply') ? false : true

if (!token) {
  console.error('Missing SANITY_API_TOKEN (or SANITY_WRITE_TOKEN).')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})

const createKey = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`

const repairArrayItems = (value) => {
  let changed = false

  if (Array.isArray(value)) {
    const next = value.map((item) => {
      if (!item || typeof item !== 'object') return item

      let nextItem = item

      if (!nextItem._key) {
        nextItem = {...nextItem, _key: createKey()}
        changed = true
      }

      const {value: repairedChild, changed: childChanged} = repairArrayItems(nextItem)
      if (childChanged) {
        nextItem = repairedChild
        changed = true
      }

      return nextItem
    })

    return {value: next, changed}
  }

  if (value && typeof value === 'object') {
    let next = value

    Object.entries(value).forEach(([key, child]) => {
      const {value: repairedChild, changed: childChanged} = repairArrayItems(child)
      if (childChanged) {
        if (next === value) next = {...value}
        next[key] = repairedChild
        changed = true
      }
    })

    return {value: next, changed}
  }

  return {value, changed}
}

const toMutableContent = (doc) => {
  const mutable = {}

  Object.entries(doc).forEach(([key, value]) => {
    if (['_id', '_rev', '_createdAt', '_updatedAt'].includes(key)) return
    mutable[key] = value
  })

  return mutable
}

const run = async () => {
  const docs = await client.fetch(`*[_type != null]{...}`)

  let changedCount = 0

  for (const doc of docs) {
    const original = toMutableContent(doc)
    const {value: repaired, changed} = repairArrayItems(original)

    if (!changed) continue

    changedCount += 1

    if (!isDryRun) {
      await client.patch(doc._id).set(repaired).commit()
    }
  }

  if (isDryRun) {
    console.log(`[dry-run] documents requiring repair: ${changedCount}`)
    console.log('Run with --apply to write fixes.')
  } else {
    console.log(`Repaired documents: ${changedCount}`)
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
