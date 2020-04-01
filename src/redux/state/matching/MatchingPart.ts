import { Action, action, Computed, Thunk, thunk, computed } from 'easy-peasy'

import { PendingAsset } from '@models'
import { Matches, Match } from '@models/Match'
import { LoupeModel } from '..'
import { ipcToDb } from '../helpers/ipcDbWindowHelper'

export interface MatchingPart {
  matches: Matches
  addMatch: Action<MatchingPart, Match>
  removeMatch: Action<MatchingPart, Match>
  clearMatches: Action<MatchingPart, void>
  unMatchedAssets: Computed<MatchingPart, PendingAsset[], LoupeModel>
  executeMatches: Thunk<MatchingPart, void, void, LoupeModel, void>
}

export const matchingPart: MatchingPart = {
  matches: {},
  addMatch: action((state, payload) => {
    const newMatch = {}
    newMatch[payload.id] = payload
    state.matches = { ...state.matches, ...newMatch }
  }),
  removeMatch: action((state, payload) => {
    delete state.matches[payload.id]
  }),
  clearMatches: action(state => {
    state.matches = {}
  }),
  unMatchedAssets: computed(
    [
      (_, globalState) => globalState.matching.pending.assets,
      state => state.matches,
    ],
    (pendingAssets, matches) =>
      Object.keys(matches).length > 0
        ? pendingAssets.filter(
            pa =>
              ![...Object.values(matches)].flatMap(m => m.assets).includes(pa)
          )
        : pendingAssets
  ),
  executeMatches: thunk((_actions, _, { getStoreState, getStoreActions }) => {
    const storeState = getStoreState()
    const project = storeState.project.current
    const matches = storeState.matching.match.matches
    const ctx = storeState.user.seats.current
    ipcToDb('perform-matches', ctx, matches)
    const refetchTree = getStoreActions().project.tree.fetch
    // Shouldn't have to do this but the realm listeners seem not to work
    // with deeply nested stuff?
    if (project) {
      refetchTree(project)
    }
  }),
}
