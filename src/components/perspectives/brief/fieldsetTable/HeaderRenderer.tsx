import * as React from 'react'
import styled from 'styled-components'
import { theme } from '@components/shared'
import { ITableHeaderCell } from './FieldsetTable'
import { HeaderDefinitionCell } from './HeaderDefinitionCell'
import { HeaderAddDefinitionCell } from './HeaderAddDefinitionCell'

const Header = styled.div`
  display: flex;
  position: relative;
  flex-grow: 1;
  background: ${theme.sectionGrey};
  border-bottom: ${theme.lightStroke};
  height: 98%;
`

export interface IHeaderCell extends ITableHeaderCell {}

interface IHeaderRenderer {
  element: Element
  columnIndex: number
  cells: JSX.Element[]
  columns: JSX.Element[]
}

// Map dynamic cell renderer components
const headerRenderers = {
  // model renderers
  FieldDefinition: HeaderDefinitionCell,
  // plain renderers
  empty: () => React.Fragment
}

// Component for custom header cells (configured as the "TableHeaderCell" custom component)..
// Dynamically renders components based on header/column props.
export const HeaderCell = (props: IHeaderCell): JSX.Element => {
  const renderer = props.column.fd.model || 'empty'
  return headerRenderers[renderer](props)
}

// Component for custom Header row
export const HeaderRenderer = ({ element, ...props}: IHeaderRenderer) => {
  return <Header>
    {props.cells}
    <HeaderAddDefinitionCell element={element} />
  </Header>
}
