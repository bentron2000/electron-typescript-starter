export { useHover } from './useHover'
export { useFocus } from './useFocus'
export { useEditable } from './useEditable'
export { usePrevious } from './usePrevious'
export { useStateLockedByPromise } from './useStateLockedByPromise'
export { delayMouseOver } from './delayMouseOver'
export * from './treeHelpers'
export { fileFormats } from '../../models/fileFormats'
export { briefFilter } from './briefHelpers'
export { useRealmQuery } from './useRealmQuery'

export const filterUndef = <T>(ts: Array<T | undefined>): T[] => {
  return ts.filter((t: T | undefined): t is T => !!t)
}

// Difference (or Symmetric difference)
export const arrayDiff = (a: any[], b: any[], symmetric = false): any[] => {
  const aSet = new Set(a)
  const bSet = new Set(b)
  return [
    ...new Set([...aSet].filter(x => !bSet.has(x))),
    ...(symmetric ? new Set([...bSet].filter(x => !aSet.has(x))) : []),
  ]
}
