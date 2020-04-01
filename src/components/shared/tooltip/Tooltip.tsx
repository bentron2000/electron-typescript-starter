import * as React from 'react'
import * as ReactDOM from 'react-dom'
import styled, { css } from 'styled-components'
import { delayMouseOver } from '@components/helpers/delayMouseOver'

const Pointer = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  bottom: -9px;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid white;
  left: calc(50% - 10px);
  top: auto;
  bottom: -10px;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid white;
  border-bottom: 0;
`

const TooltipContentContainer = styled.div<ITooltip>`
  width: ${props => (props.width ? props.width : 'max-content')};
  min-height: min-content;
  position: fixed;
  background: white;
  color: white;
  padding: ${props => props.padding || '8px'};
  box-shadow: 0 7px 13px 0 rgba(0, 0, 0, 0.23);
  border-radius: 4px;
  z-index: 1000;
  animation-name: open;
  animation-duration: 200ms;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  @keyframes open {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  ${props =>
    props.portalToRef &&
    css`
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    `}
`

export interface ITooltip {
  content: TooltipContent
  children: any
  width?: number
  space?: number
  padding?: string
  onOpen?: () => void
  onClose?: () => void
  portalToRef?: React.RefObject<any>
  onHover?: boolean
}

type TooltipContent = JSX.Element | Element | string

interface TooltipStyle {
  width?: number
  left?: number
  bottom?: number
  top?: number
}

export const Tooltip = ({
  portalToRef,
  onOpen,
  onClose,
  ...props
}: ITooltip) => {
  const [visible, setVisible] = React.useState(false)
  const [styles, setStyles] = React.useState<TooltipStyle | undefined>()
  const node = React.useRef<HTMLDivElement>(null)
  const contentNode = React.useRef<HTMLDivElement>(null)
  const tooltipRoot = document.createElement('div')
  const width = props.width || 600
  const space = props.space || 16
  const targetNode = portalToRef ? portalToRef.current : undefined
  // Create a container ref for rendering Portal children into
  const targetContainerRef = React.useRef(document.createElement('div'))

  const showTooltip = () => {
    if (!node.current) {
      return
    }
    // align the tooltip with the target
    const rootStyle: TooltipStyle = { width }
    // where on the screen is the target
    const dimensions = node.current.getBoundingClientRect()
    // center align the tooltip by taking both the target and tooltip widths into account
    rootStyle.left = dimensions.left + dimensions.width / 2 - width / 2
    // make sure it doesn't poke off the left side of the page
    rootStyle.left = Math.max(space, rootStyle.left)
    // or off the right
    rootStyle.left = Math.min(
      rootStyle.left,
      document.body.clientWidth - width - space
    )
    // set the bottom of the tooltip just above the top of the target
    rootStyle.bottom = window.innerHeight - dimensions.top + space

    // portalToRef styles
    const toRefStyle: TooltipStyle = {}
    const targetHeight = targetNode && targetNode.getBoundingClientRect()
    toRefStyle.bottom = (targetNode && targetHeight.height) + space

    setVisible(true)

    !portalToRef ? setStyles(rootStyle) : setStyles(toRefStyle)

    if (onOpen) {
      onOpen()
    }
  }

  const hideTooltip = () => {
    setVisible(false)
    setStyles(undefined)
    if (onClose) {
      onClose()
    }
  }

  const handleScroll = () => hideTooltip()
  const handleClick = (event: any) => {
    if (
      !contentNode.current ||
      (contentNode.current && contentNode.current!.contains(event.target))
    ) {
      return
    }
    hideTooltip()
  }

  React.useEffect(() => {
    if (targetNode) {
      targetNode.appendChild(targetContainerRef.current)
    } else {
      document.body.appendChild(tooltipRoot)
    }
    document.addEventListener('scroll', handleScroll, true)
    document.addEventListener('mousedown', handleClick)
    return () => {
      if (targetNode) {
        targetNode.removeChild(targetContainerRef.current)
      } else {
        document.body.removeChild(tooltipRoot)
      }
      document.removeEventListener('scroll', handleScroll, true)
      document.removeEventListener('mousedown', handleClick)
    }
  })

  React.useEffect(() => {
    if (node.current) {
      delayMouseOver(node.current, showTooltip, 300)
    }
  }, [node.current])

  return (
    <>
      {props.onHover ? (
        <div ref={node} onMouseLeave={hideTooltip}>
          {props.children}
        </div>
      ) : (
        <div ref={node} onClick={showTooltip}>
          {props.children}
        </div>
      )}
      {visible &&
        ReactDOM.createPortal(
          <TooltipContentContainer
            portalToRef={portalToRef}
            ref={contentNode}
            style={styles}
            {...props}
          >
            {props.content}
            <Pointer />
          </TooltipContentContainer>,
          targetNode ? targetContainerRef.current : tooltipRoot
        )}
    </>
  )
}
