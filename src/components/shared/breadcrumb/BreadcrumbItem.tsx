import * as React from 'react'
import { debounce } from 'lodash'
import styled, { css } from 'styled-components'
import { Flex } from '..'
import { theme } from '../Theme/theme'

const BreadcrumbListItem = styled.li`
  display: inline-block;
  height: 39px;
  max-height: 39px;
  overflow: hidden;
  :focus {
    outline: 0;
  }
`

export const BreadcrumbItemButton = styled.button<IBreadcrumbItemContent>`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  letter-spacing: 1.8px;
  background: transparent;
  border: none;
  outline: 0;
  font: 500 16px ${theme.primaryFont};
  color: ${theme.textLight};
  height: 40px;
  > span {
    ${(props: IBreadcrumbItemContent) => {
      return (
        props.maxWidth &&
        css`
          max-width: ${props.maxWidth}px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        `
      )
    }}
  }
`

export interface IBreadcrumbItem {
  first?: boolean
  last?: boolean
  selected?: boolean
  wrapped?: boolean
  onWrap?: (wrap: boolean) => void
  className?: string
  children?: any
  count?: number
  tooltipContent?: any
  maxWidthBuffer?: number
}

export interface IBreadcrumbItemContent
  extends Required<
    Pick<
      IBreadcrumbItem,
      'first' | 'last' | 'selected' | 'wrapped' | 'children' | 'tooltipContent'
    >
  > {
  maxWidth: number
}

export const BreadcrumbItem = ({
  first,
  last,
  selected,
  wrapped,
  children,
  className,
  onWrap,
  count,
  tooltipContent,
  maxWidthBuffer = 0,
}: IBreadcrumbItem) => {
  const [maxWidth, setMaxWidth] = React.useState(0)
  const node = React.useRef<HTMLLIElement>(null)
  const handleWrap = (wra: boolean) => onWrap && onWrap(wra)
  const detectWrapped = () => {
    if (node.current) {
      const bcListNode = node.current.parentElement as HTMLOListElement | null
      if (!bcListNode) {
        return
      } else {
        // Calculate space required to render all bc items & wrap if greater than parent <ol> width.
        const wrapDetectBuffer = 100 // Makes wrapping & ellipsis slightly more eager improving results.

        let bcItemsTotalWidth = 0
        for (const bcItem of bcListNode.children) {
          bcItemsTotalWidth += bcItem.scrollWidth
        }
        const wra =
          bcItemsTotalWidth >= bcListNode.offsetWidth - wrapDetectBuffer
        handleWrap(wra)

        // Config maxWidthBuffer to allow extra space for elements potentially rendered along side
        // the breadcrumb list
        const mWidth =
          (bcListNode.offsetWidth - maxWidthBuffer) / (count as number)
        setMaxWidth(wra && count ? mWidth : 0)
      }
    }
  }
  const debouncedDetectWrapped = debounce(detectWrapped, 500)

  React.useEffect(() => {
    detectWrapped()
    window.addEventListener('resize', debouncedDetectWrapped)
    return () => {
      window.removeEventListener('resize', debouncedDetectWrapped)
    }
  }, [])
  return (
    <BreadcrumbListItem className={className} ref={node}>
      <Flex align='center'>
        {children({ first, last, selected, wrapped, maxWidth, tooltipContent })}
      </Flex>
    </BreadcrumbListItem>
  )
}
