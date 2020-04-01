import { StagePermission } from '@models'
import { StageEntity, SeatEntity } from '..'

export class StagePermissionEntity {
  public static schema: Realm.ObjectSchema = {
    primaryKey: 'id',
    name: 'StagePermission',
    properties: {
      id: 'string',
      seat: {
        type: 'linkingObjects',
        objectType: 'Seat',
        property: 'stagePermissions',
      },
      stage: 'Stage',
      observe: { type: 'bool', default: false },
      interact: { type: 'bool', default: false },
    },
  }
  public id: string
  public seat: SeatEntity
  public stage: StageEntity
  public observe?: boolean
  public interact?: boolean

  public static toModel(entity: StagePermissionEntity): StagePermission {
    return {
      id: entity.id,
      model: 'StagePermission',
      seatId: entity.seat[0].id,
      stage: StageEntity.toModel(entity.stage),
      observe: entity.observe,
      interact: entity.interact,
    }
  }
}
