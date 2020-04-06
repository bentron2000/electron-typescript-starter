import { Team } from '@models/Team'

import { SeatEntity } from '@backend/schema/SeatEntity'
import { ProjectEntity } from '@backend/schema/ProjectEntity'
import { TemplateEntity } from '@backend/schema/TemplateEntity'

export class TeamEntity {
  public static schema: Realm.ObjectSchema = {
    name: 'Team',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      seats: 'Seat[]',
      projects: 'Project[]',
      owners: 'Seat[]',
      admins: 'Seat[]',
      templates: 'Template[]',
    },
  }
  public name: string
  public id: string
  public seats: SeatEntity[]
  public projects: ProjectEntity[]
  public owners: SeatEntity[]
  public admins: SeatEntity[]
  public templates: TemplateEntity[]

  public static toModel(entity: TeamEntity): Team {
    return {
      id: entity.id,
      name: entity.name,
      model: 'Team',
      seatIds: entity.seats.map(s => s.id),
      projectIds: entity.projects.map(p => p.id),
      ownerIds: entity.owners.map(o => o.id),
      adminIds: entity.admins.map(a => a.id),
      templates: entity.templates.map(t => TemplateEntity.entityToInfo(t)),
    }
  }
}
