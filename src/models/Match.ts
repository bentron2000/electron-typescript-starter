import { MediaItem, TreeInstance, PendingAsset } from '.'

export interface Matches {
  [key: string]: Match
}

export interface Match {
  readonly id: string
  assets: PendingAsset[]
  assignment: MediaItem | TreeInstance
}
