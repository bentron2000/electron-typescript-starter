export interface Asset {
  readonly id: string
  readonly model: string
  hash: string
  fileName: string
  metadata: { [key: string]: any }
  format: { ext: string; mime: string }
  mediaStateIds: string[]
  assetLocationIds: string[]
  thumbnail: string
  preview: string
}

export function buildAsset(as: Partial<Asset>): Asset {
  return {
    id: '',
    model: 'Asset',
    hash: '',
    fileName: '',
    metadata: {},
    format: { ext: 'unknown', mime: 'unknown' },
    mediaStateIds: [],
    assetLocationIds: [],
    thumbnail: '',
    preview: '',
    ...as
  }
}
