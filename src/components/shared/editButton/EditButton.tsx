import * as React from 'react'
import styled from 'styled-components'
import { Button, IButton } from '..'
import { theme } from '../Theme/theme'

const EditButtonStyles = styled(Button)`
  background: inherit;
  border: none;
  padding: 0;
  color: ${theme.grayLight};
  :hover {
    color: ${theme.yellow}
  }
`

interface EditButton extends IButton {
  onEdit?: () => void
}

export const EditButton = ({ onEdit, ...props}: EditButton) => (
  <EditButtonStyles iconLeft='edit' color={theme.grayLight} onClick={onEdit} {...props}>
    Edit
  </EditButtonStyles>
)
