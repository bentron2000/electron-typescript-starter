import * as React from 'react'
import styled from 'styled-components'
import { theme } from '../Theme/theme'

// Styled Components

const GridContainer = styled.div<Grid>`
  display: grid;
  grid-gap: ${theme.s2};
  grid-template-columns: repeat(${props => props.zoom || 3}, auto);

  @media (min-width: 1000px) {
    grid-template-columns: repeat(${props => props.zoom || 4}, auto);
  }

  @media (min-width: 2000px) {
    grid-template-columns: repeat(${props => props.zoom || 5}, auto);
  }
`

// Typing

interface Grid {
  children?: React.ReactNode
  zoom?: number
}

// Render

export const Grid = (props: Grid) => {
  return <GridContainer {...props}>{props.children}</GridContainer>
}
