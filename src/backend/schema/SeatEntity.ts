import { ipcMain, Event } from 'electron'
import { Project, Ctx, Seat } from '@models'
import {
  TeamEntity,
  StagePermissionEntity,
  UserEntity,
  ProjectEntity,
  ProjectPermissionEntity,
  RepositoryEntity,
  SectionPermissionEntity,
} from '..'
import {
  renderSuccess,
  renderError,
  LoupeRealmResponseCallback,
  ipcReply,
} from '@models/ipc'

export class SeatEntity {
  public static schema: Realm.ObjectSchema = {
    name: 'Seat',
    primaryKey: 'id',
    properties: {
      id: 'string',
      user: { type: 'linkingObjects', objectType: 'User', property: 'seats' },
      team: { type: 'linkingObjects', objectType: 'Team', property: 'seats' },
      stagePermissions: 'StagePermission[]',
      projectPermissions: 'ProjectPermission[]',
      sectionPermissions: 'SectionPermission[]',
      repositories: {
        type: 'linkingObjects',
        objectType: 'Repository',
        property: 'seat',
      },
    },
  }
  public id: string
  public user: UserEntity[]
  public team: TeamEntity[]
  public stagePermissions: StagePermissionEntity[]
  public projectPermissions: ProjectPermissionEntity[]
  public sectionPermissions: SectionPermissionEntity[]
  public repositories: RepositoryEntity[]

  public static toModel(entity: SeatEntity): Seat {
    return {
      id: entity.id,
      model: 'Seat',
      userId: entity.user[0].id,
      team: TeamEntity.toModel(entity.team[0]),
      stagePermissions: entity.stagePermissions.map(
        StagePermissionEntity.toModel
      ),
      projectPermissions: entity.projectPermissions.map(
        ProjectPermissionEntity.toModel
      ),
      repositories: entity.repositories.map(r => RepositoryEntity.toModel(r)),
    }
  }

  public static async get(
    realm: Realm,
    ctx: Ctx,
    id: string,
    callback: LoupeRealmResponseCallback
  ) {
    try {
      if (!ctx) {
        throw new Error('No Context Given')
      } else {
        const seat = await realm.objectForPrimaryKey<SeatEntity>('Seat', id)
        if (seat) {
          callback(renderSuccess(SeatEntity.toModel(seat)))
        } else {
          throw new Error('Could not fetch seat')
        }
      }
    } catch (err) {
      console.error(err)
      callback(renderError(err, 'Could not refetch seat'))
    }
  }

  public static registerListeners(realm: Realm) {
    // Projects for seat subscription listener
    ipcMain.on('subscribe-to-seat-projects', async (event: Event, ctx: Ctx) => {
      const sendResult = (projects: Project[]) => {
        ipcReply(event, 'update-seat-projects', projects)
      }
      if (ctx) {
        const unsubscribe = await ProjectEntity.getBySeatId(
          realm,
          ctx.id,
          sendResult
        )
        // One time event to be called before any new subscription
        ipcMain.once('unsubscribe-from-seat-projects', () => unsubscribe())
      }
    })
  }
}
