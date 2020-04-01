import { RepositoryEntity, AssetEntity } from '..'
import { AssetLocation } from '@models/AssetLocation'

export class AssetLocationEntity {
  public static schema: Realm.ObjectSchema = {
    primaryKey: 'id',
    name: 'AssetLocation',
    properties: {
      id: 'string',
      asset: {
        type: 'linkingObjects',
        objectType: 'Asset',
        property: 'assetLocations',
      },
      repository: 'Repository',
    },
  }
  public id: string
  public asset: AssetEntity[]
  public repository: RepositoryEntity

  public static toModel(entity: AssetLocationEntity): AssetLocation {
    return {
      id: entity.id,
      model: 'AssetLocation',
      assetId: entity.asset[0] ? entity.asset[0].id : '',
      repository: entity.repository
        ? RepositoryEntity.toModel(entity.repository)
        : undefined,
    }
  }
}
