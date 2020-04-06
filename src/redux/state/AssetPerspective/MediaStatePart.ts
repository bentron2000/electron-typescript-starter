import { MediaState } from '@models/MediaState'
import { Action, action, Thunk, thunk } from 'easy-peasy'
import { LoupeModel } from '..'
import { ipcSubscribe } from '@redux/ipc'

export interface MediaStatePart {
  current: MediaState | undefined
  set: Action<MediaStatePart, MediaState | undefined>
  clear: Action<MediaStatePart>
  fetch: Thunk<MediaStatePart, MediaState>
}

export const mediaStatePart: MediaStatePart = {
  current: undefined,
  set: action((state, payload) => {
    state.current = payload
  }),
  clear: action(state => {
    state.current = undefined
  }),
  fetch: thunk((actions, payload, { getStoreState }) => {
    const state = getStoreState() as LoupeModel
    const setterCallback = (mediaState: MediaState) => actions.set(mediaState)
    const ctx = state.user.seats.current
    const prev = state.assetPerspective.mediaState.current
      ? state.assetPerspective.mediaState.current.id
      : undefined
    if (ctx) {
      ipcSubscribe(ctx, payload.id, setterCallback, prev, 'MediaState')
    }
  }),
}
