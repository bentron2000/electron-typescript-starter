import { useState } from 'react'

export type setStateFn = (
  state: any,
  promises?: Promise<any> | Array<Promise<any>> | undefined
) => void

export function useStateLockedByPromise(initialState: any) {
  const [state, set] = useState(initialState)
  const [locked, setLocked] = useState(false)

  const setState = (st: any, promises?: Promise<any> | Array<Promise<any>>) => {
    if (locked) {
      return
    }

    if (promises) {
      setLocked(true)
      // Error should be catched and handled in the consumer. Though adding a catch here
      // prevents unnessasary "unhandled promise rejection" errors.
      const flattened: Array<Promise<any>> = [].concat.apply([promises])
      Promise.all(flattened)
        .finally(() => setLocked(false))
        .catch(() => undefined)
    }
    set(st)
  }

  return [state, locked, setState]
}
