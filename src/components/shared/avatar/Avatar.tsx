import * as React from 'react'
import styled, { css } from 'styled-components'
import { theme } from '../Theme/theme'

// Styled Components

const AvatarContainer = styled.div<Avatar>`
  margin-left: ${props => props.ml};
  margin-right: ${props => props.mr};
  padding-top: 1px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  color: ${theme.grayDarker};
  font: bold 16px/0px ${theme.primaryFont};
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  user-select: none;
  text-transform: uppercase;
  background-image: url(${props => props.image});
  background-color: ${props => props.bg};
  background-size: cover;
  background-position: center;

  ${(props: { large?: boolean }) =>
    props.large &&
    css<Avatar>`
      width: 48px;
      height: 48px;
      font-size: 20px;
      padding-left: 2px;
    `}

    ${(props: { small?: boolean }) =>
      props.small &&
      css<Avatar>`
        width: 24px;
        height: 24px;
        font-size: 13px;
      `}

  ${(props: { square?: boolean }) =>
    props.square &&
    css<Avatar>`
      border-radius: 4px;
      font-size: 16px;
    `}
`

const NotificationBadge = styled.div`
  background-color: ${theme.red};
  color: #fff;
  font: 800 13px/8px ${theme.primaryFont};
  border: 2px solid ${theme.grayDark};
  position: absolute;
  top: -4px;
  right: -4px;

  p {
    margin: 0px;
  }

  ${(props: { notifications: number }) =>
    props.notifications >= 10
      ? css<Avatar>`
          border-radius: 4px;
          padding: 5px 3px 3px;
        `
      : css<Avatar>`
          border-radius: 50%;
          padding: 5px 4px 4px;
        `}
`

// Typing

interface Avatar {
  large?: boolean
  small?: boolean
  square?: boolean
  bg?: string
  image?: string
  ml?: string
  mr?: string
  name?: string
  notifications?: number
  onClick?: () => void
}

// Render

export const Avatar = ({ onClick, ...props }: Avatar) => {
  props = { bg: theme.primary, ...props }
  const nameAcronym = () => {
    return props.name
      ? props.name
          .split(' ')
          .map(i => i[0])
          .join('')
      : ''
  }
  return (
    <AvatarContainer {...props} onClick={onClick}>
      {props.notifications && (
        <NotificationBadge notifications={props.notifications} {...props}>
          <p>{props.notifications}</p>
        </NotificationBadge>
      )}
      {nameAcronym()}
    </AvatarContainer>
  )
}
