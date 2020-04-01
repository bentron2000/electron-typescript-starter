import * as React from 'react'
import styled, { css } from 'styled-components'
import { Box, Flex, Text, Icon } from '../../shared'
import { theme } from '../Theme/theme'

//Styled Components

const ButtonContainer = styled.button<DropButton>`
  background-color: ${theme.sectionGreyDarker};
  width: 100%;
  padding: ${theme.s2};
  border: 1px dashed ${theme.grayLighter};
  border-radius: 5px;
  color: white;
  opacity: 0.8;
  transition: all 100ms;
  cursor: pointer;
  outline: none;

  :hover {
    color: ${theme.primary};
    opacity: 1;
    border: 1px dashed ${theme.primary};
  }

  ${(props: { disabled?: boolean }) =>
    props.disabled &&
    css`
      border: none;
      background: ${theme.grayLight};
      color: white;
      pointer-events: none;
      opacity: 0.2;
    `}

  ${(props: { square?: boolean }) =>
    props.square &&
    css`
      overflow: hidden;
      position: relative;
      :before {
        content: '';
        padding-bottom: 100%;
        display: inline-block;
        vertical-align: top;
      }
    `}
`

const ContentBox = styled.div`
  ${(props: { square?: boolean }) =>
    props.square &&
    css`
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      padding: ${theme.s2};
    `}
`

export interface DropButton {
  onClick?: () => void
  iconName?: string
  text?: string
  disabled?: boolean
  square?: boolean
}

//Render

export const DropButton = (props: DropButton) => {
  return (
    <ButtonContainer onClick={props.onClick} {...props}>
      <ContentBox {...props}>
        <Flex direction='column' align='center' justify='center'>
          <Box mb={theme.s2}>
            <Icon name={props.iconName} width='46px' />
          </Box>
          <Text color='inherit' subtitle>
            {props.text}
          </Text>
        </Flex>
      </ContentBox>
    </ButtonContainer>
  )
}
