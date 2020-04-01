// Get the closest matching element up the DOM tree.
export const findParent = (element: HTMLElement, selector: string): HTMLElement | null => {
  if (element && element.matches && element.matches(selector)) {
    return element
  } else if (element && element.parentElement) {
    return findParent(element.parentElement, selector)
  }
  return null
}
