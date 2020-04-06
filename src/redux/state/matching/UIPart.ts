import { Action, Thunk, action, thunk } from 'easy-peasy'
import { LoupeModel } from '..'
import { TreeDefinition } from '@models/TreeDefinition'

export interface UIPart {
  rightPanelWasOpen: boolean
  setRightPanelWasOpen: Action<UIPart, boolean>
  incoming: boolean
  setIncoming: Action<UIPart, boolean>
  closeMatching: Thunk<UIPart, void, void, LoupeModel>
  zoom: number
  setZoom: Action<UIPart, number>
  selectedTd: TreeDefinition | undefined
  selectTd: Action<UIPart, TreeDefinition>
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
  closeMatching: thunk((actions, _payload) => {
    // const store = getStoreState()
    // delete old shizzle here...
    actions.setIncoming(false)
  }),
  zoom: 3,
  setZoom: action((state, payload) => {
    state.zoom = payload
  }),
  selectedTd: undefined,
  selectTd: action((state, payload) => {
    state.selectedTd = payload
  }),
}
