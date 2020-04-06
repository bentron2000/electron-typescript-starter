import * as React from 'react'
import Table, { AutoResizer } from 'react-base-table'
import { v4 as uuid } from 'uuid'
import { findLast } from 'ramda'

import { useStoreState } from '@redux/store'

import { Element } from '@models/Element'
import { ElementData } from '@models/ElementData'

import { FieldDefinition } from '@models/FieldDefinition'
import { FieldValue } from '@models/FieldValue'

import { groupItemsByTiParent } from '@components/helpers'
import { HeaderRenderer, HeaderCell } from './HeaderRenderer'
import { RowRenderer, Cell } from './RowRenderer'

interface FieldsetTable {
  element: Element
  height?: number
  columnWidth?: number
  rowHeight?: number
  scrollToIds?: string[]
  onScrollTo?: (id: string) => void
}

interface FieldsetTableScrollEvent {
  horizontalScrollDirection: string
  scrollLeft: number
  scrollTop: number
  scrollUpdateWasRequested: boolean
  verticalScrollDirection: 'forward' | 'backward'
}

// Data format types
export interface TableDataColumn {
  dataKey: string
  key: string
  fd: Partial<FieldDefinition>
  width: number
}

export interface TableDataRow {
  id: string
  [key: string]: any
}

export interface TableData {
  rows: TableDataRow[]
  columns: TableDataColumn[]
}

// BaseTable component prop types
export interface ITableHeaderCell {
  headerIndex: number
  className: string
  column: TableDataColumn
  columns: TableDataColumn[]
  columnIndex: number
  container: any // BaseTable
}

// BaseTable component prop types
export interface ITableCell {
  cellData: FieldValue | ElementData
  rowData: TableDataRow
  rowIndex: number
  className: string
  column: TableDataColumn
  columns: TableDataColumn[]
  columnIndex: number
  container: any // BaseTable
}

const scrollToGridItem = (
  { rows, columns }: TableData,
  tableEl: any, // BaseTable
  linkToIds: string[],
  onScrollTo?: (linkId: string) => void
) => {
  rows.forEach((row, rowIndex) => {
    // Search row cells for matching id
    const colDataKey = Object.keys(row).find(k => linkToIds.includes(row[k].id))
    // Find the column of the matching row cell
    const col = columns.find(c => c.dataKey === colDataKey)
    if (col) {
      // Scroll to row by index
      tableEl.scrollToRow(rowIndex, 'smart')
      // calculate horizontal scroll from fixed column widths (https://github.com/Autodesk/react-base-table/issues/101)
      setTimeout(() => tableEl.scrollToLeft(col.width * columns.indexOf(col)))
      if (onScrollTo) {
        onScrollTo(row[col.dataKey].id)
      }
    }
  })
}

// Generate fieldset base table data from element
const createData = (
  fds: FieldDefinition[],
  groupedEds: { [key: string]: ElementData[] },
  colWidth: number
): TableData => {
  // First column is a placeholder for the blank eds first column
  const columns = [
    { dataKey: 'col-0', key: uuid(), fd: { name: '' }, width: colWidth },
  ]
  fds.forEach((fd, i) => {
    columns.push({ dataKey: `col-${i + 1}`, key: fd.id, fd, width: colWidth })
  })

  const rows = Object.keys(groupedEds)
    .map(parentId => {
      return [
        // Treebreadcrumb custom row for each groupedEd (grouped by ED TI parent TI)
        { id: parentId, model: 'TreeInstance' },
        groupedEds[parentId].map(ed => {
          const row = { id: ed.id, 'col-0': ed }
          ed.fields.forEach((fv, i) => (row[`col-${i + 1}`] = fv))
          return row
        }),
      ].flat()
    })
    .flat()

  return { rows, columns }
}

export const FieldsetTable = ({
  element,
  height = 450,
  columnWidth = 225,
  rowHeight = 50,
  scrollToIds = [],
  onScrollTo,
}: FieldsetTable) => {
  const rootTd = useStoreState(s => s.project.tree.rootTD)
  const rootTi = rootTd ? rootTd.instances[0] : undefined
  const tableRef = React.useRef<any>(null)
  const getData = () => {
    const groupedData = rootTi
      ? groupItemsByTiParent(
          rootTi,
          element.data,
          (ed: ElementData) => ed.treeInstanceIds[0]
        )
      : {}
    return createData(element.fieldDefinitions, groupedData, columnWidth)
  }

  const [data, setData] = React.useState(getData())
  // Sticky rows (only ever one currently)
  const [frozenRows, setFrozenRows] = React.useState(data.rows.slice(0, 1))
  // The latest list of rows with the current sticky row filtered out
  const rows = data.rows.filter(row => {
    return row.id !== (frozenRows[0] && frozenRows[0].id)
  })

  const components = {
    TableHeaderCell: HeaderCell,
    TableCell: Cell,
  }

  const handleScroll = React.useCallback(
    ({ scrollTop, verticalScrollDirection }: FieldsetTableScrollEvent) => {
      const dir = verticalScrollDirection
      const scrollRowIndex = Math.floor(scrollTop / rowHeight)
      // The row that the scroll position is currently at
      const scrollRow = rows[scrollRowIndex]
      // Index of the row in the original dataset
      const scrollRowDataIndex = data.rows.findIndex(r => r.id === scrollRow.id)

      if (dir === 'forward') {
        const previousRows = data.rows.slice(0, scrollRowDataIndex)
        const lastStickyRow = findLast(
          row => row.model === 'TreeInstance',
          previousRows
        )

        if (
          lastStickyRow &&
          scrollRowDataIndex >= data.rows.indexOf(lastStickyRow)
        ) {
          setFrozenRows([lastStickyRow])
        }
      } else if (dir === 'backward') {
        const frozenRowDataIndex = data.rows.findIndex(
          r => r.id === frozenRows[0].id
        )

        if (scrollRowDataIndex < frozenRowDataIndex) {
          const lastRows = data.rows.slice(0, frozenRowDataIndex)
          const stickyRow = findLast(
            row => row.model === 'TreeInstance',
            lastRows
          )
          if (stickyRow) {
            setFrozenRows([stickyRow])
          }
        }
      }
    },
    [element, frozenRows]
  )

  React.useEffect(() => setData(getData()), [element])

  React.useEffect(() => {
    if (tableRef.current) {
      scrollToGridItem(data, tableRef.current, scrollToIds, onScrollTo)
    }
  }, [tableRef.current, scrollToIds])

  return (
    <AutoResizer>
      {({ width }: { width: number }) => (
        <Table
          fixed
          ref={tableRef}
          height={height}
          components={components}
          data={rows}
          frozenData={frozenRows}
          columns={data.columns}
          width={width}
          rowHeight={rowHeight}
          onScroll={handleScroll}
          // @ts-ignore react-base-table applies the missing props internally
          headerRenderer={<HeaderRenderer element={element} />}
          // @ts-ignore react-base-table applies the missing props internally
          rowRenderer={<RowRenderer rootTd={rootTd} rootTi={rootTi} />}
        />
      )}
    </AutoResizer>
  )
}
