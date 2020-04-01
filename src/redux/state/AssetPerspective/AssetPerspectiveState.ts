import { TreePart, treePart } from './TreePart'
import { UIPart, uiPart } from './UIPart'
import { StagePart, stagePart } from './StagePart'
import { IBriefPart, briefPart } from './BriefPart'
import { MediaStatePart, mediaStatePart } from './MediaStatePart'
import { mediaStateFilterPart, MediaStateFilterPart } from './AssetFilterPart'
import { rhpPart, IRhpPart } from './RhpPart'

export interface AssetPerspectiveState {
  rhp: IRhpPart
  stage: StagePart
  mediaState: MediaStatePart
  tree: TreePart
  interface: UIPart
  filter: MediaStateFilterPart
  brief: IBriefPart
}

export const assetPerspective: AssetPerspectiveState = {
  rhp: rhpPart,
  stage: stagePart,
  brief: briefPart,
  mediaState: mediaStatePart,
  tree: treePart,
  interface: uiPart,
  filter: mediaStateFilterPart,
}
