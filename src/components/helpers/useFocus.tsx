import { useState } from 'react'

/**
 * --------------------------------------------------
 *
 *  USAGE
 *
 *  const Focusable = () => {
 *      const [focused, bindFocus] = useFocus()
 *      return (
 *        <div>
 *          <input {...bindFocus} />
 *          <h2>{focused ? 'Focused' : 'Not focused'}</h2>
 *        </div>
 *      )
 *    }
 *
 * --------------------------------------------------
 */

export function useFocus() {
  const [focused, set] = useState(false)
  const binder = {
    onFocus: () => set(true),
    onBlur: () => set(false),
  }
  return [focused, binder]
}
