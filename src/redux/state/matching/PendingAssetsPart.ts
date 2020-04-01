import { PendingAsset, Stage } from '@models'
import { action, Action, Thunk, thunk } from 'easy-peasy'
import { LoupeModel } from '..'
import { getPendingAssets } from '@models/Stage'

export interface PendingAssetsPart {
  assets: PendingAsset[]
  set: Action<PendingAssetsPart, PendingAsset[]>
  fetch: Thunk<PendingAssetsPart, Stage, void, LoupeModel>
}

export const pendingAssetsPart: PendingAssetsPart = {
  assets: [],
  set: action((state, payload) => {
    state.assets = payload
  }),
  fetch: thunk((actions, payload, { getStoreState }) => {
    const ctx = getStoreState().user.seats.current
    const setterCallback = (pendingAssets: PendingAsset[]) => {
      actions.set(pendingAssets)
    }
    if (ctx) {
      getPendingAssets(ctx, payload, setterCallback)
    }
  })
}
