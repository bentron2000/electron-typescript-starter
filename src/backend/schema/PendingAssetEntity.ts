import { ipcRenderer, Event } from 'electron'
import { Matches } from '@models/Match'
import { PendingAsset, Ctx, Stage } from '@models'
import { executeMatches } from '@utils/DBProcess/matching'
import { StageEntity } from '..'
import { ipcReply } from '@models/ipc'

export class PendingAssetEntity {
  public static schema: Realm.ObjectSchema = {
    primaryKey: 'id',
    name: 'PendingAsset',
    properties: {
      id: 'string',
      hash: { type: 'string', default: '' },
      sourcePath: 'string',
      fileName: 'string',
      metadata: { type: 'string', default: '' },
      stage: 'Stage',
      format: 'string',
      thumbnail: 'string',
      preview: 'string',
    },
  }
  public id: string
  public hash: string
  public sourcePath: string
  public fileName: string
  public metadata: string
  public stage: StageEntity
  public format: string
  public thumbnail: string
  public preview: string

  public static toModel(entity: PendingAssetEntity): PendingAsset {
    return {
      id: entity.id,
      model: 'PendingAsset',
      hash: entity.hash,
      sourcePath: entity.sourcePath,
      fileName: entity.fileName,
      metadata: JSON.parse(entity.metadata),
      stageId: entity.stage.id,
      format: JSON.parse(entity.format),
      thumbnail: entity.thumbnail,
      preview: entity.preview,
    }
  }

  // function to update/insert ourselves in the database
  public static async upsert(realm: Realm, pendingAsset: PendingAsset) {
    // PendingAsset has a stageId which we need to use to fetch the stage
    await realm.write(() => {
      const stage = realm.objectForPrimaryKey<StageEntity>(
        'Stage',
        pendingAsset.stageId
      )

      realm.create(
        'PendingAsset',
        {
          ...pendingAsset,
          metadata: JSON.stringify(pendingAsset.metadata),
          format: JSON.stringify(pendingAsset.format),
          stage,
        },
        true
      )
    })
    return pendingAsset
  }

  public static async delete(realm: Realm, pendingAsset: PendingAsset) {
    realm.write(() => {
      const pa = realm
        .objects('PendingAsset')
        .filtered(`id = '${pendingAsset.id}'`)
      realm.delete(pa)
    })
  }

  public static async clearPendingAssets(realm: Realm, stageId: string) {
    await realm.write(() => {
      const pendingResults = (realm
        .objects('PendingAsset')
        .filtered(`stage.id = '${stageId}'`) as unknown) as PendingAssetEntity[]
      // delete the item from the db
      realm.delete(pendingResults)
    })
  }

  public static registerListeners(realm: Realm) {
    // Pending Assets for stage listener
    ipcRenderer.on(
      'subscribe-to-stage-pendingAssets',
      async (event: Event, ctx: Ctx, stageId: string) => {
        const sendResult = (pendingAssets: PendingAsset[]) => {
          ipcReply(event, 'update-stage-pendingAssets', pendingAssets)
        }
        const unsubscribe = await StageEntity.getPendingAssets(
          realm,
          ctx,
          stageId,
          sendResult
        )
        // One time event to be called before any new subscription
        ipcRenderer.once('unsubscribe-from-project-stages', () => unsubscribe())
      }
    )

    // Clear pending assets
    ipcRenderer.on(
      'clear-unmatched-pending-assets',
      (_event: Event, stage: Stage) => {
        // query db for unmatched assets at a stage
        // Delete the previews and db entries for them
        console.log('clear pending assets!')
        this.clearPendingAssets(realm, stage.id)
      }
    )

    // Perform matches
    ipcRenderer.on(
      'perform-matches',
      (_event: Event, ctx: Ctx, matches: Matches) => {
        executeMatches(realm, ctx, matches)
      }
    )

    // Upsert a pending asset
    ipcRenderer.on(
      'upsert-pending-asset',
      (_event: Event, res: PendingAsset) => {
        PendingAssetEntity.upsert(realm, res)
      }
    )
  }
}
