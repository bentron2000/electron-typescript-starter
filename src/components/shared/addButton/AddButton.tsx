import * as React from 'react'
import styled from 'styled-components'
import { theme } from '../Theme/theme'
import { Button } from '..'

const AddButtonStyles = styled(Button)<AddButton>`
  background: transparent;
  color: ${props => props.color ? props.color : theme.textLight};
  font-size: 12px;
  font-weight: normal;
  text-transform: uppercase;
  .button-icon-left {
    flex: none;
  }
  :hover {
    background: inherit;
  }
  :active {
    color: ${props => props.activeColor || 'inherit'}
  }
`

interface AddButton {
  color?: string
  activeColor?: string
  children: any
  onClick?: () => void
}

export const AddButton = (props: AddButton) => {
  return (
    <AddButtonStyles text iconLeft='add' {...props}>
      {props.children}
    </AddButtonStyles>
  )
}
