import { PendingAsset } from '@models/PendingAsset'
import { Stage, getPendingAssets } from '@models/Stage'
import { action, Action, Thunk, thunk } from 'easy-peasy'
import { LoupeModel } from '..'

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
  }),
}
