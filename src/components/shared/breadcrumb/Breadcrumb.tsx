import * as React from 'react'
import styled from 'styled-components'

interface BreadcrumbList {
  wrapped: boolean
  canWrap: boolean
}

const BreadcrumbList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
`

export interface IBreadcrumb {
  margin?: string
  children?: any
  className?: string
  tooltipContent?: any
}

// Applies the dynamic BreadcrumbItem FaCC and applies children content to its resulting component.
const TruncatedBreadcrumbItemContent = ({ renderContent: Content }: { renderContent: any }) => {
  return (
    <Content>...</Content >
  )
}

export const Breadcrumb = (props: IBreadcrumb) => {
  const [wrapped, setWrapped] = React.useState(false)
  let bcItems = props.children.filter((x: any) => !!x)

  if (wrapped) {
    if (bcItems.length > 2) {
      // List of items to be truncated
      // TODO only truncate as much as necessary?
      const truncatedList = bcItems.slice(0, bcItems.length - 1)
      // The last item of the list will be used as the truncated element (allowing backward navigation)
      const lastTruncatedBcItem = truncatedList[truncatedList.length - 1]

      // Rebuild the list of BreadcrumbItems
      bcItems = [
        bcItems[0],
        React.cloneElement(
          lastTruncatedBcItem,
          { ...lastTruncatedBcItem.props },
          () => <TruncatedBreadcrumbItemContent renderContent={lastTruncatedBcItem.props.children} />
        ),
        bcItems[bcItems.length - 1]
      ]
    } else {
      setWrapped(false)
    }
  }

  const children = React.Children.map(bcItems, (child: any, i: number) => {
    return React.cloneElement(child, {
      first: i === 0,
      last: i === (bcItems || []).length - 1,
      count: bcItems.length,
      wrapped,
      onWrap: (val: boolean) => setWrapped(val),
    })
  })

  return (
    <div className={props.className} style={{ width: '100%' }}>
      <BreadcrumbList>{children}</BreadcrumbList>
    </div>
  )
}
