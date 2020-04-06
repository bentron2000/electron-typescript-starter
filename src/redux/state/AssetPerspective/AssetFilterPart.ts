import { Action, action, Computed, computed } from 'easy-peasy'
import { MediaState } from '@models/MediaState'
import { LoupeModel } from '..'
import { mediaStateFilter } from '@components/helpers/assetsHelpers'

export interface MediaStateFilter {
  treeFilter: string[]
  strict?: boolean // in strict mode, only media items connected to the target TI are returned
}

export interface MediaStateFilterPart {
  current: MediaStateFilter
  set: Action<MediaStateFilterPart, MediaStateFilter>
  filteredMediaStates: Computed<MediaStateFilterPart, MediaState[], LoupeModel>
}

export const mediaStateFilterPart: MediaStateFilterPart = {
  current: { treeFilter: [], strict: false },
  set: action((state, payload) => {
    state.current = payload
  }),
  filteredMediaStates: computed(
    [
      (_state, storeState) => storeState.project.tree.rootTD,
      state => state.current,
      (_state, storeState) =>
        storeState.assetPerspective.stage.current
          ? storeState.assetPerspective.stage.current.mediaStates
          : [],
    ],
    mediaStateFilter
  ),
}
