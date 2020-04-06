import { TreeDefinition } from '@models/TreeDefinition'
import { MediaState } from '@models/MediaState'
import {
  tIgetBranch,
  tIfindById,
  tIfilter,
  TreeInstance,
} from '@models/TreeInstance'
import { MediaStateFilter } from '@redux/state/AssetPerspective/AssetFilterPart'
import { intersection } from 'ramda'

/**
 * --------------------------------------------------
 * Filter Media States
 * --------------------------------------------------
 */
export const mediaStateFilter = (
  tree: TreeDefinition,
  filter: MediaStateFilter,
  mediaStates: MediaState[]
) => {
  const hasMediaItem = (miId: string) => (ti: TreeInstance) =>
    ti.media.map(m => m.id).includes(miId)

  // Filter brief by tree relevance - if no TreeInstances are selected, return all...
  const allowedMediaItemIds = filter.strict
    ? // strict: return true if the media item is connected to the target TI only.
      filter.treeFilter
        .flatMap(tiId => tIfindById(tree.instances[0], tiId))
        .flatMap(ti => ti.media.map(mi => mi.id))
    : // relaxed: if the media item is connected to any TI in the target branch return true.
      // get all the tree instances that connect to these media states via their media item ids.
      // get the branches for these TIs
      // return the media item id if the branch contains the filtered tiId
      mediaStates
        .filter(
          ms =>
            intersection(
              tIfilter(tree.instances[0], hasMediaItem(ms.mediaItemId))
                .flatMap(ti => tIgetBranch(tree.instances[0], ti))
                .map(ti => ti.id),
              filter.treeFilter
            ).length > 0
        )
        .map(ms => ms.mediaItemId)

  return filter.treeFilter.length > 0
    ? mediaStates.filter(ms => allowedMediaItemIds.includes(ms.mediaItemId))
    : mediaStates
}
