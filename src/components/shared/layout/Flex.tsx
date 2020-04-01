import * as React from 'react'
import styled from 'styled-components'

const FlexContainer = styled.div<IFlex>`
  display: flex;
  margin-right: ${props => props.mr};
  margin-left: ${props => props.ml};
  margin-bottom: ${props => props.mb};
  padding: ${props => props.p};
  flex-direction: ${props => props.direction};
  flex: ${props => props.flex};
  align-items: ${props => props.align};
  justify-content: ${props => props.justify};
  height: ${props => props.height};
  width: ${props => props.width};
  position: relative;
  flex-basis: ${props => props.basis};
`

export interface IFlex {
  children?: React.ReactNode
  direction?: string
  flex?: number
  align?: string
  justify?: string
  basis?: string
  height?: string
  width?: string
  mr?: string
  ml?: string
  className?: string
  mb?: string
  p?: string
  onClick?: () => void
}

export const Flex = ({ flex = 1, ...props }: IFlex) => {
  return (
    <FlexContainer flex={flex} {...props}>
      {props.children}
    </FlexContainer>
  )
}
