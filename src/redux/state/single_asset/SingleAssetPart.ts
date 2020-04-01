// import { MediaState, Stage } from '../../models'
// import { Action, action, Thunk, thunk } from 'easy-peasy'
// import { LoupeModel } from '..'

export interface SingleAssetPart {
  //   mediaStates: MediaState[]
  //   set: Action<AssetPart, MediaState[]>
  //   fetch: Thunk<AssetPart, Stage>
  //   unsub: (() => void) | undefined
  //   setUnsub: Action<AssetPart, () => void>
}

export const singleAssetPart: SingleAssetPart = {
  //   mediaStates: [],
  //   set: action((state, payload) => {
  //     state.mediaStates = payload
  //   }),
  //   fetch: thunk((actions, payload, { getStoreState }) => {
  //     const state = <LoupeModel>getStoreState()
  //     const setterCallback = (
  //       mediaStates: MediaState[],
  //       unsubFunction?: () => void
  //     ) => {
  //       actions.set(mediaStates)
  //       if (unsubFunction) {
  //         actions.setUnsub(unsubFunction)
  //       }
  //     }
  //     const seat = state.user.seats.current
  //     if (seat) {
  //       Stage.getMediaStates(
  //         seat.id,
  //         payload.id,
  //         setterCallback
  //       )
  //     }
  //   }),
  //   unsub: undefined,
  //   setUnsub: action((state, payload) => {
  //     state.unsub = payload
  //   })
}
