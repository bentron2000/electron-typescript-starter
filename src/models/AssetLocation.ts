import { Repository } from '@models'

export interface AssetLocation {
  readonly id: string
  readonly model: string
  repository?: Repository
  assetId: string
}

export function buildAssetLocation(as: Partial<AssetLocation>): AssetLocation {
  return {
    id: '',
    model: 'AssetLocation',
    assetId: '',
    ...as
  }
}
