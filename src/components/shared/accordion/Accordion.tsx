import * as React from 'react'
import styled, { css } from 'styled-components'
import { Text } from '../typography/Text'
import { Flex } from '../layout/Flex'
import { theme } from '../Theme/theme'
import { Icon } from '../icons/Icon'
import { usePrevious } from '@components/helpers'
import { Box } from '../layout/Box'
import { Omit } from '@helpers/typeScriptHelpers'

/**
 * --------------------------------------------------
 *  Loupe Accordion Titles
 * --------------------------------------------------
 */

const AccordionTitleContainer = styled.div<Omit<AccordionTitle, 'onExpand'>>`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  font-family: ${theme.primaryFont};
  letter-spacing: 1.2px;
  font-weight: 600;
  font-size: 14px;
  user-select: none;
  text-transform: uppercase;
  padding: 0px 16px 0px 16px;
  height: calc(
    ${(props: Pick<AccordionTitle, 'titleHeight'>) => props.titleHeight} - 1px
  ); // -1px to compensate for border-bottom
  cursor: pointer;
  background: ${theme.grayDark};
  border-bottom: ${theme.darkStroke};
  :hover {
    background: ${theme.elementLightGrey};
  }
  ${(props: Pick<AccordionTitle, 'top' | 'bottom'>) => {
    return (
      props.top !== undefined &&
      props.bottom !== undefined &&
      css`
        position: sticky;
        z-index: 500;
        top: ${props.top}px;
        bottom: ${props.bottom}px;
      `
    )
  }}
`

const AccordionTitleIcon = styled(Icon)`
  transition: 0.4s cubic-bezier(0.2, 0.2, 0.2, 1);
  transform: rotate(180deg);
  opacity: 0.5;
  color: #fff;
  ${({ expanded }: Pick<AccordionTitle, 'expanded'>) =>
    expanded && 'transform: rotate(0deg); opacity: 1;'}
`

interface AccordionTitle {
  title: string
  expanded: boolean
  onExpand: (titleNode: React.RefObject<HTMLDivElement>) => void
  top?: number
  bottom?: number
  titleHeight?: string
}

const AccordionTitle = ({ onExpand, ...props }: AccordionTitle) => {
  const node = React.useRef<HTMLDivElement>(null)
  return (
    <AccordionTitleContainer
      ref={node}
      {...props}
      onClick={() => onExpand(node)}
    >
      <Flex justify='space-between' align='center'>
        <Text subtitle mb='0'>
          {props.title}
        </Text>
        <AccordionTitleIcon
          name='collapse'
          width='24px'
          expanded={props.expanded}
        />
      </Flex>
    </AccordionTitleContainer>
  )
}

/**
 * --------------------------------------------------
 * Loupe Accordion Contents
 * --------------------------------------------------
 */

const AccordionBodyContainer = styled.div`
  background-color: ${theme.grayDarkest};
  transition: all 0.5s cubic-bezier(0.2, 0.2, 0.2, 1);
  opacity: ${(props: { visible?: boolean }) => (props.visible ? '1' : '0')};
`

interface AccordionBodyContainerProps {
  content: JSX.Element | string
  visible?: boolean
  onVisible: (bodyNode: React.RefObject<HTMLDivElement>) => void
}

const AccordionBody = ({
  content,
  visible,
  onVisible,
}: AccordionBodyContainerProps) => {
  const node = React.useRef<HTMLDivElement>(null)
  const previouslyVisible = usePrevious(visible)
  React.useEffect(() => {
    if (content && !previouslyVisible && visible) {
      onVisible(node)
    }
  })
  return (
    <AccordionBodyContainer ref={node} visible={visible}>
      {visible && content}
    </AccordionBodyContainer>
  )
}

/**
 * --------------------------------------------------
 *  Loupe Accordion Items
 * --------------------------------------------------
 */

export interface AccordionItem {
  // Provide id if there needs to be items with duplicate names for some reason
  id?: string
  title: string
  content: JSX.Element | string
  top?: number
  bottom?: number
  expand?: boolean
  onExpand?: (expand: boolean) => void
  titleHeight?: string
  parentNode?: React.RefObject<HTMLDivElement>
}

const AccordionItem = ({
  content,
  expand = false,
  parentNode,
  onExpand,
  ...props
}: AccordionItem) => {
  const [expanded, setExpanded] = React.useState(expand)
  const [titleNode, setTitleNode] = React.useState<
    React.RefObject<HTMLDivElement> | undefined
  >()
  const handleExpanded = (tNode: React.RefObject<HTMLDivElement>) => {
    const nextExpanded = !expanded
    setExpanded(nextExpanded)
    setTitleNode(tNode)
    if (onExpand) {
      onExpand(nextExpanded)
    }
  }
  const scrollToItem = (bodyNode: React.RefObject<HTMLDivElement>) => {
    if (
      parentNode &&
      parentNode.current &&
      titleNode &&
      titleNode.current &&
      bodyNode &&
      bodyNode.current &&
      props.top !== undefined
    ) {
      // This is working adequately, but a perfect calculation is quite difficult. Need a way
      // to detect wether the title is 'fixed' or 'relative' (i.e sticky or not)
      parentNode.current.scrollTop =
        bodyNode.current.offsetTop -
        props.top -
        titleNode.current.offsetHeight -
        parentNode.current.offsetTop
    }
  }

  React.useEffect(() => {
    setExpanded(expand)
  }, [expand])

  return (
    <>
      <AccordionTitle
        expanded={expanded}
        onExpand={handleExpanded}
        {...props}
      />
      <AccordionBody
        content={content}
        visible={expanded}
        onVisible={scrollToItem}
      />
    </>
  )
}

/**
 * --------------------------------------------------
 * Loupe Accordion
 * --------------------------------------------------
 */

// toggle when height of all items is greater than half of the available space

const AccordionContainer = styled(Box)`
  position: relative;
  height: 100%;
  overflow: auto;
`

export interface Accordion {
  items: AccordionItem[]
  sticky?: boolean
  itemTitleHeight?: string
}

const minContentSpaceForStickyMode = 60

export const Accordion = ({
  items,
  sticky = false,
  itemTitleHeight = '50px',
}: Accordion) => {
  const [isSticky, setSticky] = React.useState(sticky)
  const node = React.useRef<HTMLDivElement>(null)
  // Remove all characters that are not digits and parse as Integer
  const ithNum = Number(itemTitleHeight.replace(/\D+/g, ''))

  const autoToggleStickyMode = () => {
    if (node.current) {
      const totalHeightOfItemTitlesPercent =
        ((items.length * ithNum) / node.current.offsetHeight) * 100
      const remainingContentSpacePercent = 100 - totalHeightOfItemTitlesPercent
      setSticky(remainingContentSpacePercent >= minContentSpaceForStickyMode)
    }
  }

  React.useEffect(() => {
    if (sticky) {
      autoToggleStickyMode()
      window.addEventListener('resize', autoToggleStickyMode)
    }
    return () => {
      window.removeEventListener('resize', autoToggleStickyMode)
    }
  }, [])

  return (
    <AccordionContainer refNode={node}>
      {items.map((item, i: number) => (
        <AccordionItem
          key={item.id || item.title}
          parentNode={node}
          titleHeight={itemTitleHeight}
          {...(isSticky
            ? { top: i * ithNum, bottom: ithNum * (items.length - (i + 1)) }
            : {})}
          {...item}
        />
      ))}
    </AccordionContainer>
  )
}
