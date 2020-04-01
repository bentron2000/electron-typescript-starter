export interface MediaState {
  readonly id: string
  readonly model: string
  name: string
  mediaItemId: string
  nextStateId?: string
  previousStateId?: string
  stageId: string
  assetId: string
  ancestorId?: string
  thumbnail: string
  preview: string
}

export function buildMediaState(ms: Partial<MediaState>): MediaState {
  return {
    id: '',
    model: 'MediaState',
    name: '',
    mediaItemId: '',
    stageId: '',
    assetId: '',
    thumbnail: '',
    preview: '',
    ...ms
  }
}

// Should an incoming MediaState replace this MS (true) or make it an ancestor? (false)
export function shouldReplace(mediaState: MediaState) {
  return mediaState.ancestorId && mediaState.assetId === mediaState.ancestorId
}
