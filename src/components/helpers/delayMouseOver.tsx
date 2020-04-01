export const delayMouseOver = (
  elem: HTMLElement,
  callback: () => any,
  delay = 1000
) => {
  if (!elem) {
    return
  }

  let timeout: any = null
  elem.onmouseover = () => (timeout = setTimeout(callback, delay))
  elem.onmouseout = () => clearTimeout(timeout)
}
