import { TreeInstance } from '@models/TreeInstance'
import { MediaItem } from '@models/MediaItem'
import { PendingAsset } from '@models/PendingAsset'

export interface Matches {
  [key: string]: Match
}

export interface Match {
  readonly id: string
  assets: PendingAsset[]
  assignment: MediaItem | TreeInstance
}
