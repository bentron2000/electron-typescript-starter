import * as React from 'react'

interface IDeepLinkProvider {
  // Should be the scrollable parent container ref
  containerRef: React.RefObject<Element>
  linkToIds?: string[]
  callbacks?: Array<(...args: any[]) => void>
  children: any
}

interface IDeepLinkContext {
  link: (linkId: string, element: Element) => any
  customLinked: (linkId: string) => void
  linkToIds: string[]
}
const DeepLinkContext = React.createContext<IDeepLinkContext>(
  {} as IDeepLinkContext
)
const { Provider } = DeepLinkContext

// Get positions relative to target
const elementOffsets = (element: Element, target: Element) => {
  const rect = element.getBoundingClientRect()
  return {
    top: rect.top + target.scrollTop,
    left: rect.left + target.scrollLeft,
  }
}

// DeepLinkProvider can be used to wrap scrollable containers and link to
// elements within.
// This can provider can be further nested within the tree to "link to" multiple
// elements within different scrollable containers. Each scrollable container
// must be wrapped in a DeepLinkProvider to use link(). Alternativey,
// custom handling can be done with exposed linkToIds & unlink().
export const DeepLinkProvider = ({
  containerRef,
  linkToIds: ids = [],
  callbacks = [],
  children,
}: IDeepLinkProvider) => {
  const [linkToIds, setIds] = React.useState(ids)
  const [linkToCbs, setLinkToCbs] = React.useState(callbacks)

  // Invoke callbacks and remove ids and callbacks from queues
  const unlink = (linkId: string) => {
    const idx = linkToIds.findIndex(id => id === linkId)
    if (callbacks[idx]) {
      callbacks[idx]()
    }
    setIds(linkToIds.filter((_, i) => i !== idx))
    setLinkToCbs(linkToCbs.filter((_, i) => i !== idx))
  }

  // Scroll containerRef to given element
  const link = (linkId: string, element: Element) => {
    const target = containerRef && containerRef.current
    if (target && linkToIds.includes(linkId)) {
      const offsetTop = elementOffsets(element, target).top
      const centerOffset = (target.clientHeight - element.clientHeight) / 2
      target.scrollTop = offsetTop - centerOffset
      unlink(linkId)
    }
  }

  // Run after implementing your own link handling to run callback & clear ids queue
  const customLinked = (linkId: string) => {
    unlink(linkId)
  }

  return (
    <Provider value={{ link, customLinked, linkToIds }}>{children}</Provider>
  )
}

export const useDeepLink = () => React.useContext(DeepLinkContext)
