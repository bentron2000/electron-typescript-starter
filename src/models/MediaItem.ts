import { MediaState, TreeInstance } from '@models'

export interface NewMediaItem {
  treeInstance: TreeInstance
  name: string
}

export interface MediaItem {
  readonly id: string
  readonly model: string
  name: string
  treeInstanceId: string | undefined
  states: MediaState[]
}

export function buildMediaItem(mi: Partial<MediaItem>): MediaItem {
  return {
    id: '',
    model: 'MediaItem',
    name: '',
    treeInstanceId: undefined,
    states: [],
    ...mi
  }
}
