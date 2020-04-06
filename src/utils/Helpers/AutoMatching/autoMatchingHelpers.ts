import { PendingAsset } from '@models/PendingAsset'
import { IAMInput } from './autoMatch'

// Helpers
export const isPendingAssetOrMediaState = (
  item: IAMInput
): item is PendingAsset => {
  return (item as PendingAsset).model === 'PendingAsset'
}
