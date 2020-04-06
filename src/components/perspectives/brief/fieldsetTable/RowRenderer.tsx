import * as React from 'react'
import styled, { css } from 'styled-components'
import { theme, TreeAncestorBreadcrumb } from '@components/shared'
import { TableDataRow, ITableCell } from './FieldsetTable'
import { RowDataCell } from './RowDataCell'
import { RowFieldCell } from './RowFieldCell'
import { tIgetBranch, tIfindById, TreeInstance } from '@models/TreeInstance'
import { tDfindById, TreeDefinition } from '@models/TreeDefinition'

const Row = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  background: ${theme.sectionGrey};
`

const BcRow = styled(Row)<{ first: boolean }>`
  height: 97%;
  ${props => !props.first && css`border-top: ${theme.lightStroke};`}
  border-bottom: ${theme.lightStroke};
  background: #282E3A;
`

const RowBcContainer = styled.div`
  width: 100%;
  margin-left: 10px;
`

export interface ICell extends ITableCell {}

interface IRowRenderer {
  rootTd: TreeDefinition | undefined
  rootTi: TreeInstance | undefined
  rowIndex: number
  rowData: TableDataRow
  cells: JSX.Element[]
  columns: JSX.Element[]
  depth: number
}

// Map dynamic cell renderer components
const cellRenderers = {
  // model renderers
  ElementData: RowDataCell,
  FieldValue: RowFieldCell,
  // plain renderers
  empty: () => React.Fragment
}

// Component for custom row cells (configured as the "TableCell" custom component)..
// Dynamically renders components based on cellData props.
export const Cell = (props: ICell): JSX.Element => {
  const renderer = props.cellData ? props.cellData.model : 'empty'
  return cellRenderers[renderer](props)
}

// Component for custom Header
export const RowRenderer = ({ rootTd, rootTi, ...props}: IRowRenderer) => {
  if (rootTd && rootTi && props.rowData.model === 'TreeInstance') {
    const ti = tIfindById(rootTi, props.rowData.id)[0]
    const td = tDfindById(rootTd, ti.definitionId)[0]
    return <BcRow first={props.rowIndex === 0}>
      <RowBcContainer>
        <TreeAncestorBreadcrumb
          rootTd={rootTd}
          selectedTd={td}
          branch={tIgetBranch(rootTi, ti)}
          bcItemWidthBuffer={55}
        />
      </RowBcContainer>
    </BcRow>
  } else {
    return <Row {...props}>{props.cells}</Row>
  }
}
