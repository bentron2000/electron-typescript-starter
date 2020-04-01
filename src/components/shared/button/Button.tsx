import * as React from 'react'
import styled, { css } from 'styled-components'
import { theme } from '../Theme/theme'
import { Flex, IFlex } from '../layout/Flex'
import { Icon } from '../icons/Icon'

const ButtonContainer = styled.button<IButton>`
  margin-left: ${props => props.ml};
  margin-right: ${props => props.mr};
  padding: ${props => props.padding};
  border: 2px solid ${props => props.color};
  background: ${props => props.color};
  color: ${theme.textDark};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  font: 600 13px/24px ${theme.primaryFont};
  text-transform: uppercase;
  letter-spacing: 1.8px;
  transition: all 0.5s ${theme.easeOut};
  filter: brightness(1);
  white-space: nowrap;
  :focus {
    outline: 0;
  }
  :hover {
    filter: brightness(1.2);
  }
  :active {
    transition: all 0s;
    filter: brightness(0.9);
  }
  ${(props: { secondary?: boolean }) =>
    props.secondary &&
    css<IButton>`
      background: none;
      color: ${prp => prp.color};
      :hover {
        background: ${theme.grayDarker};
        filter: brightness(1);
      }
      :active {
        background: ${theme.grayDarker};
        box-shadow: inset 0 0 4px 0 rgba(0, 0, 0, 1);
        transition: all 0s;
        filter: brightness(0.9);
      }
    `}
  ${(props: { text?: boolean }) =>
    props.text &&
    css<IButton>`
      background: rgba(0, 0, 0, 0);
      color: ${prp => prp.color};
      border: 0px;
      :hover {
        background: rgba(0, 0, 0, 0.1);
      }
      :active {
        background: rgba(0, 0, 0, 0.3);
        transition: all 0s;
      }
    `}
  ${(
    props: { icon?: any } // TODO 'any' here was 'string' but this causes an error and I dont know enough to type this properly
  ) =>
    props.icon &&
    css<IButton>`
      background: none;
      color: ${prp => prp.color};
      border: 0px;
      display: block;
      font: 600 13px/0px ${theme.primaryFont};
      :hover {
        background: ${theme.grayDarker};
        filter: brightness(1);
      }
      :active {
        background: ${theme.grayDarker};
        box-shadow: inset 0 0 4px 0 rgba(0, 0, 0, 1);
        transition: all 0s;
        filter: brightness(0.9);
      }
    `}
  ${(props: { hoverColor?: string }) =>
    props.hoverColor &&
    css<IButton>`
      :hover {
        background: none;
        color: ${prp => prp.hoverColor};
      }
      :active {
        background: none;
        box-shadow: none;
        transition: all 0s;
        filter: brightness(0.6);
      }
    `}
  ${(props: { disabled?: boolean }) =>
    props.disabled &&
    css`
      border: 2px solid ${theme.grayLight};
      background: ${theme.grayLight};
      color: ${theme.grayDarker};
      pointer-events: none;
      opacity: 0.5;
    `}
`

const ButtonContentContainer = styled(Flex)<IButton>`
  min-width: 0;
`

export interface IButton {
  onClick?: (e: React.SyntheticEvent) => void
  onMouseDown?: (e: React.SyntheticEvent) => void
  iconLeft?: string | JSX.Element
  iconRight?: string | JSX.Element
  iconWidth?: string
  children?: React.ReactNode
  contentFlexProps?: IFlex
  secondary?: boolean
  text?: boolean
  icon?: string | JSX.Element
  disabled?: boolean
  color?: string
  hoverColor?: string
  ml?: string
  mr?: string
  padding?: string
}

export const Button = ({
  contentFlexProps = { align: 'center', justify: 'center' },
  ...props
}: IButton) => {
  props = {
    color: theme.primary,
    iconWidth: '24px',
    padding: theme.s2 + ' ' + theme.s3,
    ...props,
  }

  return (
    <ButtonContainer color={props.color} onClick={props.onClick} {...props}>
      {props.iconLeft && typeof props.iconLeft === 'string' ? (
        <Flex mr={theme.s2} className='button-icon-left' flex={0}>
          <Icon name={props.iconLeft} width='24px' />
        </Flex>
      ) : (
        props.iconLeft
      )}
      {typeof props.icon === 'string' ? (
        <Icon name={props.icon} width={props.iconWidth} />
      ) : (
        props.icon
      )}
      <ButtonContentContainer {...contentFlexProps}>
        {props.children}
      </ButtonContentContainer>
      {props.iconRight && typeof props.iconRight === 'string' ? (
        <Flex ml={theme.s2} className='button-icon-right' flex={0}>
          <Icon name={props.iconRight} width={props.iconWidth} />
        </Flex>
      ) : (
        props.iconRight
      )}
    </ButtonContainer>
  )
}
