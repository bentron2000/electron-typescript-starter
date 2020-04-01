import * as React from 'react'
import styled, { css } from 'styled-components'
import { theme } from '../Theme/theme'

// Styled Components

const baseStyles = css<IHeading>`
  margin: ${props => props.m};
  margin-left: ${props => props.ml};
  margin-right: ${props => props.mr};
  margin-top: ${props => props.mt};
  margin-bottom: ${props => props.mb};
  font-style: inherit;
  display: inline-block;
  color: ${props => props.color};
  user-select: none;
  :focus {
    outline: none;
    font-style: italic;
  }
`

const XLarge = styled.h1`
      ${baseStyles}
      font: 300 32px/40px ${theme.primaryFont};
`

const Large = styled.h2`
      ${baseStyles}
      font: 300 28px/24px ${theme.primaryFont};
`

const Medium = styled.h3`
      ${baseStyles}
      font: 500 20px/24px ${theme.primaryFont};
`

const Small = styled.h4`
      ${baseStyles}
      font: 500 18px/24px ${theme.primaryFont};
`

// Typing

export interface IHeading {
  children?: React.ReactNode
  size?: 'xlarge' | 'large' | 'medium' | 'small'
  color?: string
  m?: string
  ml?: string
  mr?: string
  mt?: string
  mb?: string
}

export const Heading = ({
  size = 'medium',
  color = 'white',
  mt = '0',
  ...props
}) => {
  props = { size, color, mt, ...props }
  return (
    <>
      {size === 'xlarge' && <XLarge {...props}>{props.children}</XLarge>}
      {size === 'large' && <Large {...props}>{props.children}</Large>}
      {size === 'medium' && <Medium {...props}>{props.children}</Medium>}
      {size === 'small' && <Small {...props}>{props.children}</Small>}
    </>
  )
}
