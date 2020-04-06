import { v4 as uuid } from 'uuid'

import { MediaItem, buildMediaItem } from '@models/MediaItem'
import { MediaState, buildMediaState } from '@models/MediaState'
import { Asset } from '@models/Asset'
import { PendingAsset } from '@models/PendingAsset'
import { Ctx } from '@models/Ctx'
import { Matches } from '@models/Match'

import { MediaItemEntity } from '@backend/schema/MediaItemEntity'
import { MediaStateEntity } from '@backend/schema/MediaStateEntity'
import { AssetEntity } from '@backend/schema/AssetEntity'
import { PendingAssetEntity } from '@backend/schema/PendingAssetEntity'

const assetFromPA = (pa: PendingAsset): Asset => {
  return {
    id: uuid(),
    model: 'Asset',
    hash: pa.hash,
    fileName: pa.fileName,
    metadata: pa.metadata,
    format: pa.format,
    mediaStateIds: [],
    assetLocationIds: [],
    thumbnail: pa.thumbnail,
    preview: pa.preview,
  }
}

const msFromPAASMI = (
  pa: PendingAsset,
  assetId: string,
  mediaItemId: string
): MediaState => {
  return buildMediaState({
    id: pa.id,
    mediaItemId,
    stageId: pa.stageId,
    assetId,
  })
}

const miFromAssetAndTiID = (asset: Asset, tiID: string): MediaItem => {
  return buildMediaItem({
    id: uuid(),
    name: asset.fileName,
    treeInstanceId: tiID,
  })
}

export const executeMatches = async (
  realm: Realm,
  ctx: Ctx,
  matches: Matches
) => {
  console.log('Executing Matches!\nTODO: build out ctx checks')
  let stageId = ''
  await Object.keys(matches).map(k => {
    const assignment = matches[k].assignment
    const pendingAssets = matches[k].assets
    stageId = matches[k].assets[0].stageId
      ? matches[k].assets[0].stageId
      : stageId

    if (assignment.model === 'TreeInstance') {
      // The assignment is a tree instance, so we are importing to new media states on new MediaItems

      Promise.all(
        pendingAssets.map(async pa => {
          const newAsset = assetFromPA(pa)
          await AssetEntity.create(realm, ctx, newAsset, [pa.stageId])

          const newMI = miFromAssetAndTiID(newAsset, assignment.id)
          await MediaItemEntity.create(realm, ctx, newMI)

          const newMS = msFromPAASMI(pa, newAsset.id, newMI.id)
          await MediaStateEntity.create(realm, ctx, newMS)

          await PendingAssetEntity.delete(realm, pa)
        })
      ).then(() => PendingAssetEntity.clearPendingAssets(realm, stageId))
    } else {
      // The assignment is a media item, so we are adding these as a new media state on the existing media item
    }
  })
  // clean up any unused pending assets
}
