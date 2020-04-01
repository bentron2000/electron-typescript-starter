import { useState } from 'react'

/**
 * --------------------------------------------------
 *
 *  USAGE
 *
 *  const Hoverable = () => {
 *      const [hovered, bindHover] = useHover()
 *      return (
 *        <div>
 *          <input {...bindHover} />
 *          <h2>{hovered ? 'Hovered' : 'Not hovered'}</h2>
 *        </div>
 *      )
 *    }
 *
 * --------------------------------------------------
 */

type useHoverReturn = [
  boolean,
  {
    onMouseEnter: () => void
    onMouseLeave: () => void
  }
]

export function useHover(): useHoverReturn {
  const [hovered, set] = useState(false)
  const binder = {
    onMouseEnter: () => set(true),
    onMouseLeave: () => set(false),
  }
  return [hovered, binder]
}
