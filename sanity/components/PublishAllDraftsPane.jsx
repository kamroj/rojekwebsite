import {useCallback, useEffect, useMemo, useState} from 'react'
import {Box, Button, Card, Flex, Spinner, Stack, Text} from '@sanity/ui'
import {useClient} from 'sanity'

const NETLIFY_BUILD_HOOK = import.meta.env?.SANITY_STUDIO_NETLIFY_BUILD_HOOK

const DRAFTS_QUERY = `*[_id in path("drafts.**")] | order(_updatedAt desc) {
  _id,
  _type,
  _updatedAt,
  _createdAt,
  _rev,
  ...
}`

const stripDraftPrefix = (id) => String(id || '').replace(/^drafts\./, '')

const toPublishableDocument = (draftDoc) => {
  const next = {...draftDoc}
  next._id = stripDraftPrefix(draftDoc?._id)
  delete next._rev
  delete next._createdAt
  delete next._updatedAt
  return next
}

const triggerNetlifyBuild = async () => {
  if (!NETLIFY_BUILD_HOOK) {
    return {triggered: false}
  }

  const response = await fetch(NETLIFY_BUILD_HOOK, {method: 'POST'})

  if (!response.ok) {
    throw new Error(`Netlify build hook failed (status ${response.status})`)
  }

  return {triggered: true}
}

export function PublishAllDraftsPane() {
  const client = useClient({apiVersion: '2025-01-01'})

  const [drafts, setDrafts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPublishingDrafts, setIsPublishingDrafts] = useState(false)
  const [isPublishingToWebsite, setIsPublishingToWebsite] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const refreshDrafts = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const result = await client.fetch(DRAFTS_QUERY)
      setDrafts(Array.isArray(result) ? result : [])
    } catch (error) {
      setErrorMessage(error?.message || 'Could not fetch drafts list.')
    } finally {
      setIsLoading(false)
    }
  }, [client])

  useEffect(() => {
    refreshDrafts()
  }, [refreshDrafts])

  const draftCount = drafts.length
  const isBusy = isPublishingDrafts || isPublishingToWebsite
  const canPublishDrafts = draftCount > 0 && !isBusy && !isLoading
  const canPublishToWebsite = draftCount === 0 && !isBusy && !isLoading && Boolean(NETLIFY_BUILD_HOOK)

  const lastUpdatedLabel = useMemo(() => {
    if (draftCount === 0) return ''
    const lastUpdated = drafts[0]?._updatedAt
    if (!lastUpdated) return ''

    return new Date(lastUpdated).toLocaleString('pl-PL')
  }, [draftCount, drafts])

  const handlePublishAllDrafts = async () => {
    if (!canPublishDrafts) return

    setIsPublishingDrafts(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const tx = client.transaction()

      drafts.forEach((draft) => {
        const nextDoc = toPublishableDocument(draft)
        tx.createOrReplace(nextDoc)
        tx.delete(draft._id)
      })

      await tx.commit()
      const publishedLabel = `${draftCount} draft${draftCount === 1 ? '' : 's'}`

      setSuccessMessage(`Opublikowano ${publishedLabel}.`)
      await refreshDrafts()
    } catch (error) {
      setErrorMessage(error?.message || 'Could not publish drafts.')
    } finally {
      setIsPublishingDrafts(false)
    }
  }

  const handlePublishToWebsite = async () => {
    if (!canPublishToWebsite) return

    const confirmed = window.confirm(
      'Czy na pewno chcesz opublikować stronę? Spowoduje to uruchomienie buildu w Netlify.',
    )

    if (!confirmed) return

    setIsPublishingToWebsite(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const buildResult = await triggerNetlifyBuild()

      if (!buildResult.triggered) {
        throw new Error('Brak konfiguracji SANITY_STUDIO_NETLIFY_BUILD_HOOK.')
      }

      setSuccessMessage('Uruchomiono publikację strony (Netlify build).')
      await refreshDrafts()
    } catch (error) {
      setErrorMessage(error?.message || 'Nie udało się uruchomić publikacji strony.')
    } finally {
      setIsPublishingToWebsite(false)
    }
  }

  return (
    <Box padding={4}>
      <Card padding={4} radius={3} shadow={1} border>
        <Stack space={4}>
          <Stack space={2}>
            <Text size={2} weight="semibold">
              Akcje publikacji
            </Text>
            <Text size={1} muted>
              Najpierw opublikuj wszystkie drafty, a dopiero potem uruchom publikację strony.
            </Text>
          </Stack>

          <Flex align="center" gap={3}>
            {isLoading ? <Spinner muted /> : null}
            <Text size={1}>
              {isLoading
                ? 'Loading drafts…'
                : `Draft count: ${draftCount}${lastUpdatedLabel ? ` (last update: ${lastUpdatedLabel})` : ''}`}
            </Text>
          </Flex>

          <Flex gap={2} wrap="wrap">
            <Button
              text={isPublishingDrafts ? 'Publikowanie draftów…' : 'Opublikuj wszystkie wersje robocze'}
              tone="primary"
              disabled={!canPublishDrafts}
              onClick={handlePublishAllDrafts}
            />
            <Button
              text={isPublishingToWebsite ? 'Uruchamianie publikacji…' : 'Opublikuj na stronę'}
              tone="positive"
              disabled={!canPublishToWebsite}
              onClick={handlePublishToWebsite}
            />
            <Button text="Odśwież" mode="ghost" disabled={isLoading || isBusy} onClick={refreshDrafts} />
          </Flex>

          {!NETLIFY_BUILD_HOOK ? (
            <Card tone="caution" padding={3} radius={2}>
              <Text size={1}>
                Brak zmiennej SANITY_STUDIO_NETLIFY_BUILD_HOOK. Uzupełnij ją, aby działał przycisk
                „Opublikuj na stronę”.
              </Text>
            </Card>
          ) : null}

          {draftCount > 0 ? (
            <Card tone="transparent" padding={3} radius={2} border>
              <Text size={1}>
                „Opublikuj na stronę” jest zablokowane, bo istnieją drafty. Najpierw użyj „Opublikuj
                wszystkie wersje robocze”.
              </Text>
            </Card>
          ) : null}

          {errorMessage ? (
            <Card tone="critical" padding={3} radius={2}>
              <Text size={1}>{errorMessage}</Text>
            </Card>
          ) : null}

          {successMessage ? (
            <Card tone="positive" padding={3} radius={2}>
              <Text size={1}>{successMessage}</Text>
            </Card>
          ) : null}
        </Stack>
      </Card>
    </Box>
  )
}