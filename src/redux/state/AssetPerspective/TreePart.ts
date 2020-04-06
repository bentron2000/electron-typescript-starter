import { Action, action, Computed, computed } from 'easy-peasy'
import { LoupeModel } from '../'
import { TreeInstance } from '@models/TreeInstance'
import { TITreeItem, tiToTreeItem } from '@components/helpers/treeHelpers'

export interface TreePart {
  selectedTI: TreeInstance | null
  setSelected: Action<TreePart, TreeInstance>
  tree: Computed<TreePart, TITreeItem[], LoupeModel>
}

export const treePart: TreePart = {
  selectedTI: null,
  setSelected: action((state, payload) => {
    state.selectedTI = payload
  }),
  tree: computed(
    [
      (_, globalState) => globalState.project.tree.rootTI,
      (_, globalState) => globalState.assetPerspective.mediaState.current,
    ],
    (rootTi, ms) => {
      if (!rootTi) {
        return []
      }
      const matchMs = (ti: TreeInstance) =>
        ms ? Boolean(ti.media.find(m => m.id === ms.mediaItemId)) : false
      return rootTi.children.map(ti => tiToTreeItem(ti, matchMs))
    }
  ),
}
