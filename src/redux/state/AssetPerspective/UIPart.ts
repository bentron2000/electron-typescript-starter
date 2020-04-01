import { Action, action } from 'easy-peasy'

export interface UIPart {
  assetsZoom: number
  setAssetsZoom: Action<UIPart, number>
}

export const uiPart: UIPart = {
  assetsZoom: 4, // TODO better place for this constant?
  setAssetsZoom: action((state, payload) => {
    state.assetsZoom = payload
  })
}
