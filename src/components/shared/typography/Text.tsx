import * as React from 'react'
import styled, { css } from 'styled-components'
import { theme } from '../Theme/theme'

const baseStyles = css<IText>`
  margin: ${props => props.m};
  margin-left: ${props => props.ml};
  margin-right: ${props => props.mr};
  margin-top: ${props => props.mt};
  margin-bottom: ${props => props.mb};
  display: ${props => props.display};
  color: ${props => props.color};
  text-align: ${props => props.align};
  letter-spacing: 0.4px;
  text-transform: none;
  ${props =>
    props.ellipsis &&
    css`
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `}
`

const boldText = css<IText>`
  ${(props: { bold?: boolean }) =>
    props.bold &&
    `
      font-weight: 600;
    `}
`

const Body = styled.p`
      ${baseStyles}
      font: 300 16px/24px ${theme.primaryFont};
      ${boldText}
`

const Subtitle = styled.p`
      ${baseStyles}
      font: 500 12px/20px ${theme.primaryFont};
      text-transform: uppercase;
      letter-spacing: 1.8px;
      ${boldText}
`

const Small = styled.p`
      ${baseStyles}
      font: 400 14px/20px ${theme.primaryFont};
      ${boldText}
`

interface IText {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  children?: React.ReactNode
  body?: boolean
  subtitle?: boolean
  small?: boolean
  bold?: boolean
  ellipsis?: boolean
  color?: string
  display?: string
  ml?: string
  mr?: string
  mt?: string
  mb?: string
  m?: string
  align?: string
}

export const Text = ({ color = 'white', mt = '0', ...rest }: IText) => {
  const props = { color, mt, ...rest }
  return (
    <>
      {props.body && <Body {...props}>{props.children}</Body>}
      {props.subtitle && <Subtitle {...props}>{props.children}</Subtitle>}
      {props.small && <Small {...props}>{props.children}</Small>}
    </>
  )
}
