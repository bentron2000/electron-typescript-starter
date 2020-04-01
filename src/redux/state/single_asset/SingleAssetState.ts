import { uiPart, UIPart } from './UIPart'
import { SingleAssetPart, singleAssetPart } from './SingleAssetPart'

/**
 * --------------------------------------------------
 *  Single Asset STATE
 * --------------------------------------------------
 */

export interface SingleAssetState {
  ui: UIPart
  assets: SingleAssetPart
}

export const singleAsset: SingleAssetState = {
  ui: uiPart,
  assets: singleAssetPart,
}
