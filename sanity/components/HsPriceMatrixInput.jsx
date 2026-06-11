import {useMemo, useState} from 'react'
import {Badge, Box, Button, Card, Flex, Stack, Text, TextArea} from '@sanity/ui'
import {set} from 'sanity'

// Sentinel stored in price arrays for "CNZ" (price on request) — Sanity drops nulls in number arrays.
export const CNZ_SENTINEL = -1

const BAND_PATTERN = /^(\d{3,4})\s*[-–—]\s*(\d{3,4})$/

const createKey = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`

const parseBand = (raw) => {
  const match = raw.trim().match(BAND_PATTERN)
  if (!match) return null
  return {min: Number(match[1]), max: Number(match[2])}
}

const parsePriceCell = (raw) => {
  const trimmed = raw.trim()
  if (/^cnz$/i.test(trimmed)) return CNZ_SENTINEL
  // Excel may paste Polish formats: "14 720,24" (incl. NBSP / narrow NBSP separators).
  const normalized = trimmed.replace(/[\s\u00A0\u202F]/g, '').replace(',', '.')
  const value = Number.parseFloat(normalized)
  if (!Number.isFinite(value) || value <= 0) return null
  return Math.round(value * 100) / 100
}

/**
 * Parse a table pasted from Excel (TSV): header row = width bands,
 * first column = height bands, cells = prices in PLN or "CNZ".
 */
export const parseMatrixTsv = (text) => {
  const errors = []
  const warnings = []
  const lines = (text || '')
    .replace(/\r/g, '')
    .split('\n')
    .filter((line) => line.trim().length > 0)

  if (lines.length < 2) {
    return {matrix: null, errors: ['Wklej tabelę z nagłówkiem szerokości i co najmniej jednym wierszem.'], warnings}
  }

  const headerCells = lines[0].split('\t')
  // The corner cell (above height bands) is optional — detect it by checking if the first cell is a band.
  const headerOffset = parseBand(headerCells[0]) ? 0 : 1
  const widthBands = []
  headerCells.slice(headerOffset).forEach((cell, index) => {
    if (!cell.trim()) return
    const band = parseBand(cell)
    if (!band) {
      errors.push(`Nagłówek, kolumna ${index + 1}: „${cell.trim()}” nie jest przedziałem (np. 1800-2000).`)
      return
    }
    if (band.min >= band.max) {
      errors.push(`Nagłówek, kolumna ${index + 1}: przedział ${band.min}-${band.max} ma „od” ≥ „do”.`)
      return
    }
    widthBands.push(band)
  })

  if (!widthBands.length) {
    return {matrix: null, errors: errors.length ? errors : ['Nie znaleziono przedziałów szerokości w nagłówku.'], warnings}
  }

  const rows = []
  let droppedInnerEmptyCells = false
  lines.slice(1).forEach((line, lineIndex) => {
    const rowNumber = lineIndex + 1
    const cells = line.split('\t')
    // The height band is the first non-empty cell (selections may start with empty columns).
    let bandIndex = 0
    while (bandIndex < cells.length && !cells[bandIndex].trim()) {
      bandIndex += 1
    }
    const band = parseBand(cells[bandIndex] ?? '')
    if (!band) {
      errors.push(`Wiersz ${rowNumber}: „${(cells[bandIndex] || '').trim()}” nie jest przedziałem wysokości.`)
      return
    }
    if (band.min >= band.max) {
      errors.push(`Wiersz ${rowNumber}: przedział ${band.min}-${band.max} ma „od” ≥ „do”.`)
      return
    }

    // Drop empty cells: Excel sheets often have an empty spacer column between
    // the height column and the price area, plus trailing empties.
    const rawPriceCells = cells.slice(bandIndex + 1)
    let trailingEmpty = 0
    for (let i = rawPriceCells.length - 1; i >= 0 && !rawPriceCells[i].trim(); i -= 1) {
      trailingEmpty += 1
    }
    const priceCells = rawPriceCells.filter((cell) => cell.trim().length > 0)
    if (priceCells.length + trailingEmpty < rawPriceCells.length) {
      droppedInnerEmptyCells = true
    }
    if (priceCells.length !== widthBands.length) {
      errors.push(
        `Wiersz ${rowNumber}: liczba cen (${priceCells.length}) nie zgadza się z liczbą przedziałów szerokości (${widthBands.length}).`
      )
      return
    }

    const prices = []
    priceCells.forEach((cell, cellIndex) => {
      const price = parsePriceCell(cell)
      if (price === null) {
        errors.push(`Wiersz ${rowNumber}, kolumna ${cellIndex + 1}: „${cell.trim()}” nie jest ceną ani CNZ.`)
        return
      }
      prices.push(price)
    })
    if (prices.length !== widthBands.length) return

    rows.push({heightMin: band.min, heightMax: band.max, prices})
  })

  if (!rows.length) {
    return {matrix: null, errors: errors.length ? errors : ['Nie znaleziono żadnego poprawnego wiersza.'], warnings}
  }

  if (droppedInnerEmptyCells) {
    warnings.push(
      'Pominięto puste kolumny wewnątrz tabeli (np. kolumnę odstępu z Excela) — sprawdź w podglądzie, czy ceny trafiły do właściwych przedziałów.'
    )
  }

  const isContiguous = (items, getMin, getMax) =>
    items.every((item, index) => index === 0 || getMin(item) === getMax(items[index - 1]))
  if (!isContiguous(widthBands, (b) => b.min, (b) => b.max)) {
    warnings.push('Przedziały szerokości nie są ciągłe lub rosnące — sprawdź nagłówek.')
  }
  if (!isContiguous(rows, (r) => r.heightMin, (r) => r.heightMax)) {
    warnings.push('Przedziały wysokości nie są ciągłe lub rosnące — sprawdź pierwszą kolumnę.')
  }

  if (errors.length) {
    return {matrix: null, errors, warnings}
  }

  return {
    matrix: {
      widthBands: widthBands.map((band) => ({_key: createKey(), ...band})),
      rows: rows.map((row) => ({_key: createKey(), ...row})),
    },
    errors: [],
    warnings,
  }
}

const priceFormatter = new Intl.NumberFormat('pl-PL', {minimumFractionDigits: 0, maximumFractionDigits: 2})

const MatrixGrid = ({matrix}) => {
  if (!matrix?.widthBands?.length || !matrix?.rows?.length) return null

  return (
    <Box style={{overflowX: 'auto'}}>
      <table style={{borderCollapse: 'collapse', fontSize: 12, whiteSpace: 'nowrap'}}>
        <thead>
          <tr>
            <th style={cellStyle}>wys. \ szer. (mm)</th>
            {matrix.widthBands.map((band, index) => (
              <th key={band._key || index} style={cellStyle}>
                {band.min}–{band.max}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.rows.map((row, rowIndex) => (
            <tr key={row._key || rowIndex}>
              <th style={cellStyle}>
                {row.heightMin}–{row.heightMax}
              </th>
              {(row.prices || []).map((price, priceIndex) => (
                <td key={priceIndex} style={{...cellStyle, textAlign: 'right'}}>
                  {price === CNZ_SENTINEL ? <Badge tone="caution">CNZ</Badge> : priceFormatter.format(price)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  )
}

const cellStyle = {
  border: '1px solid var(--card-border-color, #ccc)',
  padding: '4px 8px',
}

export default function HsPriceMatrixInput(props) {
  const {value, onChange, readOnly} = props

  const [rawText, setRawText] = useState('')
  const [pendingResult, setPendingResult] = useState(null)
  const [savedMessage, setSavedMessage] = useState('')

  const storedSummary = useMemo(() => {
    if (!value?.widthBands?.length || !value?.rows?.length) return null
    return `Zapisana tabela: ${value.rows.length} przedziałów wysokości × ${value.widthBands.length} przedziałów szerokości.`
  }, [value])

  const handleParse = (text) => {
    setSavedMessage('')
    setPendingResult(text.trim() ? parseMatrixTsv(text) : null)
  }

  const handleTextChange = (event) => {
    setRawText(event.currentTarget.value)
    handleParse(event.currentTarget.value)
  }

  const handleSave = () => {
    if (!pendingResult?.matrix) return
    onChange(set(pendingResult.matrix))
    setRawText('')
    setPendingResult(null)
    setSavedMessage('Tabela została zapisana. Pamiętaj o opublikowaniu dokumentu.')
  }

  return (
    <Stack space={3}>
      <TextArea
        rows={5}
        value={rawText}
        onChange={handleTextChange}
        readOnly={readOnly}
        placeholder={
          'Zaznacz w Excelu cały obszar tabeli — wiersz z przedziałami szerokości, kolumnę z przedziałami wysokości ' +
          'i wszystkie ceny — następnie skopiuj (Ctrl+C) i wklej tutaj (Ctrl+V).\n' +
          'Puste kolumny odstępu zostaną pominięte. Komórki bez ceny wpisz jako CNZ.'
        }
      />

      {pendingResult?.errors?.length ? (
        <Card padding={3} radius={2} tone="critical">
          <Stack space={2}>
            <Text size={1} weight="semibold">
              Błędy w wklejonej tabeli:
            </Text>
            {pendingResult.errors.map((error, index) => (
              <Text key={index} size={1}>
                • {error}
              </Text>
            ))}
          </Stack>
        </Card>
      ) : null}

      {pendingResult?.warnings?.length ? (
        <Card padding={3} radius={2} tone="caution">
          <Stack space={2}>
            {pendingResult.warnings.map((warning, index) => (
              <Text key={index} size={1}>
                • {warning}
              </Text>
            ))}
          </Stack>
        </Card>
      ) : null}

      {pendingResult?.matrix ? (
        <Card padding={3} radius={2} tone="primary" border>
          <Stack space={3}>
            <Text size={1} weight="semibold">
              Podgląd nowej tabeli — sprawdź wartości i zapisz:
            </Text>
            <MatrixGrid matrix={pendingResult.matrix} />
            <Flex>
              <Button
                text="Zapisz tabelę"
                tone="positive"
                disabled={readOnly}
                onClick={handleSave}
              />
            </Flex>
          </Stack>
        </Card>
      ) : null}

      {savedMessage ? (
        <Card padding={3} radius={2} tone="positive">
          <Text size={1}>{savedMessage}</Text>
        </Card>
      ) : null}

      {!pendingResult?.matrix && storedSummary ? (
        <Card padding={3} radius={2} tone="transparent" border>
          <Stack space={3}>
            <Text size={1} muted>
              {storedSummary}
            </Text>
            <MatrixGrid matrix={value} />
          </Stack>
        </Card>
      ) : null}
    </Stack>
  )
}
