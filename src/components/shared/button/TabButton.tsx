import * as React from 'react'
import styled, { css } from 'styled-components'
import { theme } from '../Theme/theme'
import { Icon } from '../icons/Icon'

// Styled Components

const TabButtonContainer = styled.button<TabButton>`
  padding: ${theme.s3};
  color: ${theme.grayLight};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ${theme.easeOut};
  border: none;
  background: none;
  :hover {
    color: white;
  }
  :focus {
    outline: 0;
  }

  ${(props: { isActive?: boolean }) =>
    props.isActive &&
    css<TabButton>`
      background: none;
      color: ${theme.primary};
      border-left: 4px solid ${theme.primary};
      pointer-events: none;
    `}
`

// Typing

interface TabButton {
  onClick?: () => void
  icon?: string
  isActive?: boolean
}

// Render

export const TabButton = (props: TabButton) => {
  return (
    <TabButtonContainer onClick={props.onClick} {...props}>
      <Icon name={props.icon} width='32px' />
    </TabButtonContainer>
  )
}
