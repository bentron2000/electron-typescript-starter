import * as React from 'react'
import styled, { css } from 'styled-components'
import { Icon, Text, Flex, Button } from '../../shared'
import { theme } from '../Theme/theme'
import { Box } from '../layout/Box'
import { validIToastOptsTypes } from './ToastProvider'

const typeColor = (type: string) => {
  return type === 'positive'
    ? theme.green
    : type === 'negative'
    ? theme.red
    : type === 'informative'
    ? theme.primary
    : theme.green
}

const ToastItemContainer = styled(Flex)<Pick<Toast, 'onMouseEnter' | 'onMouseLeave' | 'type' | 'closing'>>`
  height: auto;
  width: 290px;
  margin: 10px;
  background-color: ${props =>
    props.type === 'positive'
      ? 'rgba(84, 194, 162, 0.2)'
      : props.type === 'negative'
      ? 'rgba(255, 88, 108, 0.2)'
      : props.type === 'informative'
      ? 'rgba(232, 169, 46, 0.2)'
      : theme.green};
  color: ${props => typeColor(props.type)};
  border-radius: 5px;
  box-shadow: ${theme.largeShadow};
  animation-name: open;
  animation-duration: 200ms;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  @keyframes open {
    from {
      height: 0px;
      opacity: 0;
    }
    to {
      height: 50px;
      opacity: 1;
    }
  }
  ${(props: Pick<Toast, 'closing'>) => (
    props.closing && css`
      animation-name: close;
      animation-duration: 200ms;
      animation-iteration-count: 1;
      animation-fill-mode: forwards;
      @keyframes close {
        from {
          height: 50px;
          opacity: 1;
        }
        to {
          height: 0px;
          opacity: 0;
        }
      }
    `
  )}
`
interface Toast {
  children: any
  type: validIToastOptsTypes
  closing?: boolean
  onRemove: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export const Toast = ({
  children,
  onRemove,
  onMouseEnter,
  onMouseLeave,
  type
}: Toast) => {
  const [toastClosing, setToastClosing] = React.useState(false)
  return (
    <>
      <ToastItemContainer
        type={type}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        closing={toastClosing}
      >
        <Box
          radius='5px 0 0 5px'
          p={theme.s2}
          bg={typeColor(type)}
          color='white'
        >
          <Icon name={type} width='16px' />
        </Box>
        <Box width='100%' p={`4px ${theme.s2}`}>
          <Flex align='center' justify='space-between' width='100%'>
            <Text small color='inherit' mb='0'>
              {children}
            </Text>
            <Button
              color={typeColor(type)}
              icon='close'
              onClick={() => {
                setTimeout(onRemove, 200), setToastClosing(!toastClosing)
              }}
              hoverColor='none'
              padding='0'
            />
          </Flex>
        </Box>
      </ToastItemContainer>
    </>
  )
}
