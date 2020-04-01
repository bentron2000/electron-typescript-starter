import { uiPart, UIPart } from './UIPart'
import { pendingAssetsPart, PendingAssetsPart } from './PendingAssetsPart'
import { MatchingPart, matchingPart } from './MatchingPart'

/**
 * --------------------------------------------------
 *  Matching STATE
 * --------------------------------------------------
 */

export interface MatchingState {
  ui: UIPart
  pending: PendingAssetsPart
  match: MatchingPart
}

export const matching: MatchingState = {
  ui: uiPart,
  pending: pendingAssetsPart,
  match: matchingPart,
}
