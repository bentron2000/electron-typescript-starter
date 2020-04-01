import * as React from 'react'
import styled, { css } from 'styled-components'
import { theme } from '../Theme/theme'

// Styled Components

const PopOverContainer = styled.div<PopOver>`
  background: white;
  width: ${props => props.width};
  transition: opacity 0s ${theme.easeOut};
  opacity: 0;
  border-radius: 4px;
  box-shadow: ${theme.mediumShadow};
  position: absolute;
  bottom: 100%;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  z-index: 10000;
  display: none;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  pointer-events: none;
  display: flex;
  overflow: none;

  ${(props: { showPopOver?: boolean }) =>
    props.showPopOver &&
    css<PopOver>`
      bottom: 130%;
      opacity: 1;
      pointer-events: auto;
      transition: all 0.2s ${theme.easeOut};
    `}

  ${(props: { pointerRight?: string }) =>
    props.pointerRight &&
    css<PopOver>`
      right: 0;
      left: auto;
      transform: none;
    `}

  ${(props: { pointerLeft?: string }) =>
    props.pointerLeft &&
    css<PopOver>`
      left: 0;
      right: auto;
      transform: none;
    `}

  ${(props: { below?: boolean }) =>
    props.below &&
    css<PopOver>`
      top: 130%;
      bottom: auto;
    `}
`

const PopOverContent = styled.div<PopOver>`
  text-align: left;
  width: 100%;
`

const Pointer = styled.div<PopOver>`
  position: absolute;
  width: 0;
  height: 0;
  bottom: -9px;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid white;
  left: ${props => props.pointerLeft};
  right: ${props => props.pointerRight};

  ${(props: { below?: boolean }) =>
    props.below &&
    css<PopOver>`
      top: -9px;
      bottom: auto;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid white;
      border-top: 0;
    `}
`

const HiddenButton = styled.div<PopOver>`
  cursor: pointer;
`

// Typing

interface PopOver {
  children?: React.ReactNode
  content?: React.ReactNode
  below?: boolean
  pointerRight?: string
  pointerLeft?: string
  showPopOver?: boolean
  closeOnContentClick?: boolean
  width?: string
}

// Render

// >> Ben - Had to resort to `event: any` below - do you know a better solution for this typing?
// >> Also, do you think this could be refactored as a helper?

export const PopOver = (props: PopOver) => {
  const [popOverOpen, setPopOverOpen] = React.useState(false)
  const node = React.useRef<HTMLDivElement>(null)

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    setPopOverOpen(!popOverOpen)
  }

  const handleGlobalClick = (event: any) => {
    if (node.current!.contains(event.target)) {
      return
    }
    setPopOverOpen(false)
  }

  React.useEffect(() => {
    document.addEventListener('mousedown', handleGlobalClick)

    return () => {
      document.removeEventListener('mousedown', handleGlobalClick)
    }
  })

  return (
    <div ref={node} style={{ position: 'relative' }}>
      <PopOverContainer showPopOver={popOverOpen} {...props}>
        <PopOverContent
          onClick={() => props.closeOnContentClick && setPopOverOpen(false)}
        >
          {props.content}
        </PopOverContent>
        <Pointer
          pointerLeft={props.pointerLeft}
          pointerRight={props.pointerRight}
          below={props.below}
        />
      </PopOverContainer>
      <HiddenButton onClick={handleClick}>{props.children}</HiddenButton>
    </div>
  )
}
