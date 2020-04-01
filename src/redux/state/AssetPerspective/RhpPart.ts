import { action, Action } from 'easy-peasy'
import { IRhpState, filterRhpPayload } from '@redux/state/helpers/rhpState'

export interface IRhpPart {
  tree: IRhpState
  setTree: Action<IRhpPart, IRhpState>
  briefInfo: IRhpState
  setBriefInfo: Action<IRhpPart, IRhpState>
  setAllUnlocked: Action<IRhpPart>
}

export const rhpPart: IRhpPart = {
  tree: { expand: true },
  setTree: action((state, payload) => {
    state.tree = {
      ...state.tree,
      ...filterRhpPayload(state.tree.locked, payload),
    }
  }),
  briefInfo: {},
  setBriefInfo: action((state, payload) => {
    state.briefInfo = {
      ...state.briefInfo,
      ...filterRhpPayload(state.briefInfo.locked, payload),
    }
  }),
  setAllUnlocked: action(state => {
    Object.keys(state).forEach(key => (state[key].locked = undefined))
  }),
}
