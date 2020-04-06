import { v4 as uuid } from 'uuid'
import { ProjectPermission } from '@models/ProjectPermission'
import { SeatEntity } from '@backend/schema/SeatEntity'
import { ProjectEntity } from '@backend/schema/ProjectEntity'
import { INewTemplateEntities } from '@backend/schema/TemplateEntity'

export class ProjectPermissionEntity {
  public static schema: Realm.ObjectSchema = {
    primaryKey: 'id',
    name: 'ProjectPermission',
    properties: {
      id: 'string',
      seat: {
        type: 'linkingObjects',
        objectType: 'Seat',
        property: 'projectPermissions',
      },
      project: 'Project',
      admin: { type: 'bool', default: false },
      edit: { type: 'bool', default: false },
      delete: { type: 'bool', default: false },
    },
  }
  public id: string
  public seat: SeatEntity
  public project: ProjectEntity
  public admin: boolean
  public edit?: boolean
  public delete?: boolean

  public static toModel(entity: ProjectPermissionEntity): ProjectPermission {
    return {
      id: entity.id,
      model: 'ProjectPermission',
      seatId: entity.seat[0].id,
      project: ProjectEntity.toModel(entity.project),
      admin: entity.admin,
      edit: entity.edit,
      delete: entity.delete,
    }
  }

  public static createFromTemplate(
    realm: Realm,
    seat: SeatEntity,
    newEntities: INewTemplateEntities
  ) {
    const pPerm = realm.create<ProjectPermissionEntity>('ProjectPermission', {
      id: uuid(),
      project: newEntities.project,
      admin: true,
      edit: true,
      delete: true,
    })
    seat.projectPermissions.push(pPerm)
    return pPerm
  }
}
