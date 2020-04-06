import { TeamEntity } from '@backend/schema/TeamEntity'
import { StageEntity } from '@backend/schema/StageEntity'
import { StagePermissionEntity } from '@backend/schema/StagePermissionEntity'
import { UserEntity } from '@backend/schema/UserEntity'
import { SeatEntity } from '@backend/schema/SeatEntity'
import { ProjectEntity } from '@backend/schema/ProjectEntity'
import { ProjectPermissionEntity } from '@backend/schema/ProjectPermissionEntity'
import { SectionEntity } from '@backend/schema/SectionEntity'
import { ElementEntity } from '@backend/schema/ElementEntity'
import { ElementDataEntity } from '@backend/schema/ElementDataEntity'
import { TreeDefinitionEntity } from '@backend/schema/TreeDefinitionEntity'
import { TreeInstanceEntity } from '@backend/schema/TreeInstanceEntity'
import { MediaItemEntity } from '@backend/schema/MediaItemEntity'
import { MediaStateEntity } from '@backend/schema/MediaStateEntity'
import { AssetEntity } from '@backend/schema/AssetEntity'
import { PendingAssetEntity } from '@backend/schema/PendingAssetEntity'
import { RepositoryEntity } from '@backend/schema/RepositoryEntity'
import { SubscriptionEntity } from '@backend/schema/SubscriptionEntity'
import { StageTransitionEntity } from '@backend/schema/StageTransitionEntity'
import { FieldDefinitionEntity } from '@backend/schema/FieldDefinitionEntity'
import { FieldValueEntity } from '@backend/schema/FieldValueEntity'
import { TemplateEntity } from '@backend/schema/TemplateEntity'

import * as loupeEntities from '@backend'

export const newModelInstanceFromResults = (entity: Realm.Object) => {
  const res = loupeEntities[`${entity.objectSchema().name}Entity`].toModel(
    entity
  )
  // Julian put this here during the refactor. I don't know what it was meant to do. Remove soon.
  // if (entity.objectSchema().name === 'Seat') {
  //   return {
  //     id: res.id,
  //     model: res.model,
  //     userId: res.userId,
  //     team: res.team,
  //     repositoryIds: res.repositoryIds
  //   }
  // }
  return res
}

export const fetchByTypeNameId = async (
  realm: Realm,
  entityName: string,
  id: string
) => {
  const realmObject = await realm
    .objects(entityName)
    .filtered(`id == '${id}'`)[0]
  switch (entityName) {
    case 'Project':
      return realmObject as Realm.Object & ProjectEntity
    case 'Seat':
      return realmObject as Realm.Object & SeatEntity
    case 'Stage':
      return realmObject as Realm.Object & StageEntity
    case 'Team':
      return realmObject as Realm.Object & TeamEntity
    case 'User':
      return realmObject as Realm.Object & UserEntity
    case 'StagePermission':
      return realmObject as Realm.Object & StagePermissionEntity
    case 'ProjectPermission':
      return realmObject as Realm.Object & ProjectPermissionEntity
    case 'Section':
      return realmObject as Realm.Object & SectionEntity
    case 'Element':
      return realmObject as Realm.Object & ElementEntity
    case 'TreeDefinition':
      return realmObject as Realm.Object & TreeDefinitionEntity
    case 'TreeInstance':
      return realmObject as Realm.Object & TreeInstanceEntity
    case 'ElementData':
      return realmObject as Realm.Object & ElementDataEntity
    case 'MediaItem':
      return realmObject as Realm.Object & MediaItemEntity
    case 'MediaState':
      return realmObject as Realm.Object & MediaStateEntity
    case 'StageTransition':
      return realmObject as Realm.Object & StageTransitionEntity
    case 'Asset':
      return realmObject as Realm.Object & AssetEntity
    case 'Repository':
      return realmObject as Realm.Object & RepositoryEntity
    case 'Subscription':
      return realmObject as Realm.Object & SubscriptionEntity
    case 'PendingAsset':
      return realmObject as Realm.Object & PendingAssetEntity
    case 'FieldDefinition':
      return realmObject as Realm.Object & FieldDefinitionEntity
    case 'FieldValue':
      return realmObject as Realm.Object & FieldValueEntity
    case 'Template':
      return realmObject as Realm.Object & TemplateEntity
    default:
      throw new Error('Hey! No fair!')
  }
}
