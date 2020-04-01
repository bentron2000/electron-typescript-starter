import * as React from 'react'
import styled from 'styled-components'

// Styled Components

const BoxContainer = styled.div<Box>`
  width: ${props => props.width};
  height: ${props => props.height};
  margin: ${props => props.m};
  margin-right: ${props => props.mr};
  margin-left: ${props => props.ml};
  margin-bottom: ${props => props.mb};
  padding: ${props => props.p};
  color: ${props => props.color};
  background: ${props => props.bg};
  box-shadow: ${props => props.shadow};
  display: ${props => props.display || 'inline-block'};
  position: relative;
  border: ${props => props.border};
  border-top: ${props => props.bt};
  border-bottom: ${props => props.bb};
  border-left: ${props => props.bl};
  border-right: ${props => props.br};
  overflow: ${props => props.overflow};
  border-radius: ${props => props.radius};

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-corner {
    background: none;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
  }
`

// Typing

export interface Box {
  children?: React.ReactNode
  width?: string
  height?: string
  display?: string
  color?: string
  bg?: string
  m?: string
  mr?: string
  ml?: string
  mb?: string
  p?: string
  shadow?: string
  border?: string
  bt?: string
  bb?: string
  bl?: string
  br?: string
  overflow?: string
  radius?: string
  refNode?: React.RefObject<HTMLDivElement>
  onClick?: (event: React.MouseEvent) => void
}

// Render

export const Box = ({ refNode, ...props }: Box) => {
  return (
    <BoxContainer ref={refNode} {...props}>
      {props.children}
    </BoxContainer>
  )
}
