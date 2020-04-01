import {
  ProjectEntity,
  StagePermissionEntity,
  ProjectPermissionEntity,
  TreeDefinitionEntity,
  TreeInstanceEntity,
  ElementDataEntity,
  MediaStateEntity,
  StageTransitionEntity,
  SeatEntity,
  StageEntity,
  TeamEntity,
  UserEntity,
  SectionEntity,
  ElementEntity,
  MediaItemEntity,
  AssetEntity,
  SubscriptionEntity,
  PendingAssetEntity,
  FieldDefinitionEntity,
  FieldValueEntity,
  RepositoryEntity,
  TemplateEntity,
} from '..'

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
