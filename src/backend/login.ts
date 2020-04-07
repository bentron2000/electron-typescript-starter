import Realm from 'realm'
import { createMockData as sync_mock } from './mockdata/sequitur'
import { createMockData as offline_mock } from './mockdata/sequitur_offline'
import { LoginUserObj } from '@models/User'

// import { UserEntity } from '@backend/schema/UserEntity'
import { TeamEntity } from '@backend/schema/TeamEntity'
import { StageEntity } from '@backend/schema/StageEntity'
import { StagePermissionEntity } from '@backend/schema/StagePermissionEntity'
import { SeatEntity } from '@backend/schema/SeatEntity'
import { ProjectEntity } from '@backend/schema/ProjectEntity'
import { ProjectPermissionEntity } from '@backend/schema/ProjectPermissionEntity'
import { SectionEntity } from '@backend/schema/SectionEntity'
import { SectionPermissionEntity } from '@backend/schema/SectionPermissionEntity'
import { ElementEntity } from '@backend/schema/ElementEntity'
import { ElementDataEntity } from '@backend/schema/ElementDataEntity'
import { TreeDefinitionEntity } from '@backend/schema/TreeDefinitionEntity'
import { TreeInstanceEntity } from '@backend/schema/TreeInstanceEntity'
import { MediaItemEntity } from '@backend/schema/MediaItemEntity'
import { MediaStateEntity } from '@backend/schema/MediaStateEntity'
import { AssetEntity } from '@backend/schema/AssetEntity'
import { PendingAssetEntity } from '@backend/schema/PendingAssetEntity'
import { AssetLocationEntity } from '@backend/schema/AssetLocationEntity'
import { RepositoryEntity } from '@backend/schema/RepositoryEntity'
import { SubscriptionEntity } from '@backend/schema/SubscriptionEntity'
import { StageTransitionEntity } from '@backend/schema/StageTransitionEntity'
import { FieldDefinitionEntity } from '@backend/schema/FieldDefinitionEntity'
import { FieldValueEntity } from '@backend/schema/FieldValueEntity'
import { TemplateEntity } from '@backend/schema/TemplateEntity'

const userSchema: Realm.ObjectSchema = {
  name: 'User',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    // lastTeam: 'string?',
    seats: 'Seat[]',
  },
}

export const instance = 'loupetestinstance.de1a.cloud.realm.io'
export const authUrl = `https://${instance}`
const schema = [
  TeamEntity.schema,
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
  userSchema, // UserEntity.schema,
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
    // Local db only (offline), Note that this will be relative to the Application Support folder for the db renderer window
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
