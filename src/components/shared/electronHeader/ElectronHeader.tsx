import * as React from 'react'
import styled from 'styled-components'

const ElectronHeaderContainer = styled.div`
  height: 23px;
  border-bottom: 1px solid #252c34;
  background-color: #2a303b;
  -webkit-app-region: drag; /* lets the electron app be dragged from this panel */
`
export const ElectronHeader = () => {
  return <ElectronHeaderContainer />
}
