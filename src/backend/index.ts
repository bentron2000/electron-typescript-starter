import Realm from 'realm'
import { createMockData as sync_mock } from './mockdata/sequitur' // './mockdata/mockdata'
import { createMockData as offline_mock } from './mockdata/sequitur_offline' // './mockdata/mockdata'
import { TeamEntity } from './schema/TeamEntity'
import { StageEntity } from './schema/StageEntity'
import { StagePermissionEntity } from './schema/StagePermissionEntity'
import { UserEntity } from './schema/UserEntity'
import { SeatEntity } from './schema/SeatEntity'
import { ProjectEntity } from './schema/ProjectEntity'
import { ProjectPermissionEntity } from './schema/ProjectPermissionEntity'
import { SectionEntity } from './schema/SectionEntity'
import { SectionPermissionEntity } from './schema/SectionPermissionEntity'
import { ElementEntity } from './schema/ElementEntity'
import { ElementDataEntity } from './schema/ElementDataEntity'
import { TreeDefinitionEntity } from './schema/TreeDefinitionEntity'
import { TreeInstanceEntity } from './schema/TreeInstanceEntity'
import { MediaItemEntity } from './schema/MediaItemEntity'
import { MediaStateEntity } from './schema/MediaStateEntity'
import { AssetEntity } from './schema/AssetEntity'
import { PendingAssetEntity } from './schema/PendingAssetEntity'
import { AssetLocationEntity } from './schema/AssetLocationEntity'
import { RepositoryEntity } from './schema/RepositoryEntity'
import { SubscriptionEntity } from './schema/SubscriptionEntity'
import { StageTransitionEntity } from './schema/StageTransitionEntity'
import { FieldDefinitionEntity } from './schema/FieldDefinitionEntity'
import { FieldValueEntity } from './schema/FieldValueEntity'
import { TemplateEntity } from './schema/TemplateEntity'
import { LoginUserObj } from '@models/User'

export {
  TeamEntity,
  StageEntity,
  StagePermissionEntity,
  UserEntity,
  SeatEntity,
  ProjectEntity,
  ProjectPermissionEntity,
  SectionEntity,
  SectionPermissionEntity,
  ElementEntity,
  ElementDataEntity,
  TreeDefinitionEntity,
  TreeInstanceEntity,
  MediaItemEntity,
  MediaStateEntity,
  AssetEntity,
  PendingAssetEntity,
  RepositoryEntity,
  SubscriptionEntity,
  AssetLocationEntity,
  StageTransitionEntity,
  FieldDefinitionEntity,
  FieldValueEntity,
  TemplateEntity,
}

const instance = 'loupetestinstance.de1a.cloud.realm.io'
const authUrl = `https://${instance}`
const schema = [
  TeamEntity.schema,
  UserEntity.schema,
  SeatEntity.schema,
  ProjectEntity.schema,
  ProjectPermissionEntity.schema,
  StagePermissionEntity.schema,
  StageEntity.schema,
  SectionEntity.schema,
  SectionPermissionEntity.schema,
  ElementEntity.schema,
  ElementDataEntity.schema,
  TreeDefinitionEntity.schema,
  TreeInstanceEntity.schema,
  MediaItemEntity.schema,
  MediaStateEntity.schema,
  AssetEntity.schema,
  PendingAssetEntity.schema,
  RepositoryEntity.schema,
  SubscriptionEntity.schema,
  AssetLocationEntity.schema,
  StageTransitionEntity.schema,
  FieldDefinitionEntity.schema,
  FieldValueEntity.schema,
  TemplateEntity.schema,
]

//
// The global realm instance used throughout the app. Is initialised to a local-only
// realm, then is swapped out for a synced one when the log-in is successful
//

export const login = async (
  userObj: LoginUserObj
): Promise<[Realm, boolean]> => {
  let mockDatawasInserted = false
  if (!userObj.sync) {
    // Local db only (offline)
    const realm = new Realm({ schema, path: './src/backend/db/loupe.realm' })
    const stuff = await realm.objects('User')
    if (stuff.length === 0) {
      console.log('No data in realm db - inserting mock data...')
      offline_mock(realm)
      mockDatawasInserted = true
    }
    return [realm, mockDatawasInserted]
  } else {
    // Sync Realm (online)
    Object.keys(Realm.Sync.User.all).map(uId =>
      Realm.Sync.User.all[uId].logout()
    )
    let user = Realm.Sync.User.current
    if (!user) {
      if (userObj.sync) {
        // user = await Realm.Sync.User.login(authUrl, 'jules', 'julian')
        user = await Realm.Sync.User.login(authUrl, userObj.id, userObj.pass)
      } else {
        const creds = Realm.Sync.Credentials.anonymous()
        user = await Realm.Sync.User.login(authUrl, creds)
      }
    }

    const remoteConfig = user.createConfiguration({
      sync: {
        url: `realms://${instance}/new-test`,
        error: console.log,
        fullSynchronization: true,
      },
      schema,
      path: './src/backend/db-sync/loupe.realm',
    })

    const realm = await Realm.open(remoteConfig)

    // // Add mock data if the database is empty
    const stuff = await realm.objects('User')
    if (stuff.length === 0) {
      console.log('No data in realm db - inserting mock data...')
      sync_mock(realm)
      mockDatawasInserted = true
    }

    return [realm, mockDatawasInserted]
  }
}

/**
 * --------------------------------------------------
 * Export Helpers
 * --------------------------------------------------
 */

export {
  newModelInstanceFromResults,
  fetchByTypeNameId,
} from './helpers/realmHelpers'
