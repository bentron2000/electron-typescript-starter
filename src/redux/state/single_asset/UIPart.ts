import { Action, Thunk, action, thunk } from 'easy-peasy'
import { LoupeModel } from '..'

export interface UIPart {
  rightPanelWasOpen: boolean
  setRightPanelWasOpen: Action<UIPart, boolean>
  incoming: boolean
  setIncoming: Action<UIPart, boolean>
  closeAsset: Thunk<UIPart, void, void, LoupeModel>
  assetZoom: number
  setAssetZoom: Action<UIPart, number>
}

export const uiPart: UIPart = {
  rightPanelWasOpen: true,
  setRightPanelWasOpen: action((state, payload) => {
    state.rightPanelWasOpen = payload
  }),
  incoming: false,
  setIncoming: action((state, payload) => {
    state.incoming = payload
  }),
  closeAsset: thunk((actions, _payload) => {
    // const store = getStoreState()
    // delete old shizzle here...
    actions.setIncoming(false)
  }),
  assetZoom: 3,
  setAssetZoom: action((state, payload) => {
    state.assetZoom = payload
  })
}
