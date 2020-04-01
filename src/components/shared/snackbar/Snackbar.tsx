import * as React from 'react'
import styled, { css } from 'styled-components'
import { Button, Text } from '..'
import { theme } from '../Theme/theme'

// Styled Components

const SnackbarContainer = styled.div<ISnackbar>`
  height: 0px;
  position: relative;
  width: 100%;
  color: ${theme.grayDarker};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 300ms;
  overflow: hidden;

  ${(props: { expanded?: boolean }) =>
    props.expanded &&
    css<ISnackbar>`
      height: 32px;
    `}

  ${(props: { timeout?: boolean }) =>
    props.timeout &&
    css<ISnackbar>`
      animation-name: timeout;
      animation-duration: 500ms;
      animation-delay: 2s;
      animation-iteration-count: 1;
      animation-fill-mode: forwards;
      @keyframes timeout {
        from {
          height: 32px;
        }
        to {
          height: 0px;
        }
      }
    `}

  ${(props: { type?: string }) =>
    props.type === 'neutral' &&
    css<ISnackbar>`
      background-color: ${theme.primary};
    `}

  ${(props: { type?: string }) =>
    props.type === 'positive' &&
    css<ISnackbar>`
      background-color: ${theme.green};
    `}

  ${(props: { type?: string }) =>
    props.type === 'negative' &&
    css<ISnackbar>`
      background-color: ${theme.red};
    `}
`

const CloseContainer = styled.div`
  position: absolute;
  height: 100%;
  display: flex;
  align-items: center;
  right: ${theme.s2};
`

// Typing

interface ISnackbar {
  children?: React.ReactNode
  type?: 'neutral' | 'positive' | 'negative'
  timeout?: boolean
  expanded?: boolean
  handleClose?: () => void
}

// Render

export const Snackbar = (props: ISnackbar) => {
  return (
    <SnackbarContainer {...props}>
      <Text mb='0' small color='inherit'>
        {props.children}
      </Text>
      {props.handleClose && (
        <CloseContainer>
          <Button
            icon='close'
            color={theme.grayLight}
            hoverColor={theme.grayDark}
            onClick={props.handleClose}
            padding='0'
          />
        </CloseContainer>
      )}
    </SnackbarContainer>
  )
}
