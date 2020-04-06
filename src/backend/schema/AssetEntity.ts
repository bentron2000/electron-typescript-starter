import { v4 as uuid } from 'uuid'
import { Ctx } from '@models/Ctx'
import { Asset } from '@models/Asset'
import { MediaStateEntity } from '@backend/schema/MediaStateEntity'
import { AssetLocationEntity } from '@backend/schema/AssetLocationEntity'
import { RepositoryEntity } from '@backend/schema/RepositoryEntity'

export class AssetEntity {
  public static schema: Realm.ObjectSchema = {
    primaryKey: 'id',
    name: 'Asset',
    properties: {
      id: 'string',
      hash: 'string',
      fileName: 'string',
      metadata: 'string?',
      format: 'string',
      mediaStates: {
        type: 'linkingObjects',
        objectType: 'MediaState',
        property: 'asset',
      },
      assetLocations: 'AssetLocation[]',
      thumbnail: 'string',
      preview: 'string',
    },
  }
  public id: string
  public hash: string
  public fileName: string
  public metadata: string
  public format: string
  public mediaStates: MediaStateEntity[]
  public assetLocations: AssetLocationEntity[]
  public thumbnail: string
  public preview: string

  public static toModel(entity: AssetEntity): Asset {
    return {
      id: entity.id,
      model: 'Asset',
      hash: entity.hash,
      fileName: entity.fileName,
      metadata: JSON.parse(entity.metadata),
      format: JSON.parse(entity.format),
      mediaStateIds: entity.mediaStates.map(ms => ms.id),
      assetLocationIds: entity.assetLocations.map(al => al.id),
      thumbnail: entity.thumbnail || '',
      preview: entity.preview || '',
    }
  }

  public static async create(
    realm: Realm,
    ctx: Ctx,
    asset: Asset,
    args: [string]
  ) {
    // args is a stageId
    // Check here that the user has permission to create an asset (in the current user context)
    console.log(
      `create asset: dont forget to build out the ctx business...${ctx}`
    ) // this will do something some day...

    // // Get the stage we're creating the asset in...
    const stageId = args[0]

    // Get its repositories
    // NB Potential race condition on concurrent subscription / ingestion
    const repositories = ((await realm
      .objects('Repository')
      .filtered(
        `subscriptions.stage.id = '${stageId}'`
      )) as unknown) as Realm.Results<RepositoryEntity>

    // create our asset with a new location for every repository
    const newAsset = {
      id: asset.id || uuid(),
      hash: asset.hash,
      fileName: asset.fileName,
      metadata: JSON.stringify(asset.metadata),
      format: JSON.stringify(asset.format),
      thumbnail: asset.thumbnail || '',
      preview: asset.preview || '',
      mediaStates: [],
      assetLocations: repositories.map(repo => {
        return {
          id: uuid(),
          repository: repo,
        }
      }),
    }

    await realm.write(() => {
      realm.create('Asset', newAsset, true)
    })
  }
}
