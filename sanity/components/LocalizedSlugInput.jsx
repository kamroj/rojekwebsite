import {useMemo} from 'react'
import {Button, Card, Flex, Stack, Text} from '@sanity/ui'
import {set, useFormValue} from 'sanity'

const LANGS = ['pl', 'en', 'de', 'fr']

const slugify = (input) => {
  const value = String(input || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return value
}

export default function LocalizedSlugInput(props) {
  const {value, onChange} = props
  const documentValue = useFormValue([])

  const normalizedValue = useMemo(() => {
    const current = value && typeof value === 'object' ? value : {}
    return {
      pl: typeof current.pl === 'string' ? current.pl : '',
      en: typeof current.en === 'string' ? current.en : '',
      de: typeof current.de === 'string' ? current.de : '',
      fr: typeof current.fr === 'string' ? current.fr : '',
    }
  }, [value])

  const generateFromNames = () => {
    const localizedName = documentValue?.localizedName && typeof documentValue.localizedName === 'object'
      ? documentValue.localizedName
      : {}

    const next = {
      ...normalizedValue,
      pl: slugify(localizedName.pl || documentValue?.name || normalizedValue.pl),
      en: slugify(localizedName.en || normalizedValue.en),
      de: slugify(localizedName.de || normalizedValue.de),
      fr: slugify(localizedName.fr || normalizedValue.fr),
    }

    onChange(set(next))
  }

  const normalizeExisting = () => {
    const next = LANGS.reduce((acc, lang) => {
      acc[lang] = slugify(normalizedValue[lang])
      return acc
    }, {})

    onChange(set(next))
  }

  return (
    <Stack space={3}>
      {props.renderDefault(props)}

      <Card padding={2} radius={2} tone="transparent" border>
        <Stack space={2}>
          <Flex gap={2} wrap="wrap">
            <Button
              text="Generuj slugi z nazw"
              mode="ghost"
              tone="primary"
              onClick={generateFromNames}
            />
            <Button
              text="Normalizuj slugi"
              mode="ghost"
              tone="default"
              onClick={normalizeExisting}
            />
          </Flex>
          <Text size={1}>
            Kliknij „Generuj slugi z nazw”, aby automatycznie uzupełnić slugi z nazw PL/EN/DE/FR.
          </Text>
        </Stack>
      </Card>
    </Stack>
  )
}