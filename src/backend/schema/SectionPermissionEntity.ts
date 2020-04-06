import { v4 as uuid } from 'uuid'

import { SectionPermission } from '@models/SectionPermission'

import { StageEntity } from '@backend/schema/StageEntity'
import { SeatEntity } from '@backend/schema/SeatEntity'
import { SectionEntity } from '@backend/schema/SectionEntity'
import { INewTemplateEntities } from '@backend/schema/TemplateEntity'

export interface SectionPermissionTemplate {
  id: string
  sectionId: string
  stageId: string
}

export class SectionPermissionEntity {
  public static schema: Realm.ObjectSchema = {
    primaryKey: 'id',
    name: 'SectionPermission',
    properties: {
      id: 'string',
      section: 'Section',
      stage: {
        type: 'linkingObjects',
        objectType: 'Stage',
        property: 'sectionPermissions',
      },
      seat: {
        type: 'linkingObjects',
        objectType: 'Seat',
        property: 'sectionPermissions',
      },
    },
  }
  public id: string
  public section: SectionEntity
  public stage: StageEntity[]
  public seat: SeatEntity[]

  constructor(object: Partial<SectionPermissionEntity> = {}) {
    Object.assign(this, object)
  }

  public static toModel(entity: SectionPermissionEntity): SectionPermission {
    return {
      id: entity.id,
      model: 'SectionPermission',
      stage: StageEntity.toModel(entity.stage[0]),
      section: SectionEntity.toModel(entity.section),
      seatId: entity.seat[0].id,
    }
  }

  public static toTemplate(
    entity: SectionPermissionEntity,
    _options?: any
  ): SectionPermissionTemplate {
    return {
      id: `template(${entity.id})`,
      sectionId: `template(${entity.section.id})`,
      stageId: `template(${entity.stage[0].id})`,
    }
  }

  public static createFromTemplate(
    realm: Realm,
    sectionPermissions: SectionPermissionTemplate[],
    newEntities: INewTemplateEntities,
    seat: SeatEntity
  ) {
    // Try to create section permissions for this batch
    const sp = sectionPermissions.map(s => {
      const section = newEntities.sections.find(sect => sect.id === s.sectionId)
      if (section) {
        const perm = realm.create<SectionPermissionEntity>(
          'SectionPermission',
          {
            ...s,
            section,
          }
        )
        const stage = newEntities.stages.find(st => st.id === s.stageId)
        if (stage) {
          stage.sectionPermissions.push(perm)
          return perm
        }
      }
      return
    })

    if (sp.filter(Boolean).length === 0) {
      // If no section permissions were created, then at least
      // push the sections onto the seat so they aren't orphaned
      return newEntities.sections.map(section => {
        const perm = realm.create<SectionPermissionEntity>(
          'SectionPermission',
          {
            id: uuid(),
            section,
          }
        )
        seat.sectionPermissions.push(perm)
        return perm
      })
    } else {
      return []
    }
  }
}
