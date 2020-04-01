import * as React from 'react'
import { without } from 'ramda'

/**
 * Use nice click selecting on a grid of items made from an array.
 * Usage:
 * const [selected, onSelect] = useGridSelect(arrayOfItems)
 * TODO: Enhance with clickdrag, also fix incongruent single deselect behaviour
 */

export const useGridSelect = <T>(
  allItems: T[]
): [
  T[],
  (item: T, event?: React.MouseEvent<HTMLElement>) => void,
  () => void
] => {
  const [lastSelected, setLastSelected] = React.useState<number | undefined>(
    undefined
  )
  const [selected, setSelected] = React.useState<T[]>([])

  const onSelect = (item: T, event?: React.MouseEvent<HTMLElement>) => {
    const index = allItems.indexOf(item)
    if (lastSelected !== undefined && event && event.shiftKey) {
      const indices =
        index > lastSelected
          ? [lastSelected, index + 1]
          : [index, lastSelected + 1]
      const range = allItems.slice(...indices)
      const toAdd = range.filter(i => !selected.includes(i))
      setSelected([...selected, ...toAdd])
    } else if (event && event.metaKey) {
      setSelected(
        selected.includes(item)
          ? without([item], selected)
          : [...selected, item]
      )
    } else {
      setSelected(selected.includes(item) ? without([item], selected) : [item])
    }
    setLastSelected(index)
  }

  const clearSelected = () => setSelected([])

  return [selected, onSelect, clearSelected]
}
