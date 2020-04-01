import { Repository, Ctx } from '@models'
import { v4 as uuid } from 'uuid'
import * as path from 'path'

import {
  AssetLocationEntity,
  SeatEntity,
  TeamEntity,
  SubscriptionEntity,
} from '..'
import {
  renderSuccess,
  renderError,
  LoupeRealmResponseCallback,
} from '@models/ipc'
import { RepoConfig } from '@models/Repository'

export class RepositoryEntity {
  public static schema: Realm.ObjectSchema = {
    primaryKey: 'id',
    name: 'Repository',
    properties: {
      id: 'string',
      name: 'string',
      assetLocations: {
        type: 'linkingObjects',
        objectType: 'AssetLocation',
        property: 'repository',
      },
      subscriptions: {
        type: 'linkingObjects',
        objectType: 'Subscription',
        property: 'repository',
      },
      seat: 'Seat?',
      team: 'Team?',
      config: 'string?',
    },
  }
  public id: string
  public name: string
  public assetLocations: AssetLocationEntity[]
  public subscriptions: SubscriptionEntity[]
  public seat?: SeatEntity
  public team?: TeamEntity
  public config?: string

  public static toModel(entity: RepositoryEntity): Repository {
    return {
      id: entity.id,
      model: 'Repository',
      name: entity.name,
      seatId: entity.seat && entity.seat.id,
      teamId: entity.team && entity.team.id,
      ownerName:
        (entity.seat
          ? entity.seat.user[0].name
          : entity.team && entity.team.name) || '',
      numStages: entity.subscriptions.length,
      config:
        entity.config && entity.config.length > 2
          ? JSON.parse(entity.config)
          : ({} as RepoConfig),
    }
  }

  public static async create(
    realm: Realm,
    ctx: Ctx,
    payload: Repository,
    responseCallback: LoupeRealmResponseCallback
  ) {
    // Check here that the user has permission to create a repository (in the current user context)
    console.log(`create: dont forget to build out the ctx business...${ctx}`) // this will do something some day...
    try {
      if (!ctx) {
        throw new Error('Could not fetch context')
      }
      // When we create a repository
      await realm.write(() => {
        // Creating a repository.

        const seat = realm.objectForPrimaryKey<SeatEntity>('Seat', ctx.id)
        if (!seat) {
          throw new Error('Could not fetch context')
        }

        const genName = () => {
          if (payload.name.length > 0) {
            return payload.name
          } else if (payload.config.path) {
            return path.basename(payload.config.path)
          } else {
            return 'New Repository'
          }
        }

        // make a new repo - just for seats rn.
        const newRepository = realm.create<RepositoryEntity>('Repository', {
          id: uuid(),
          name: genName(),
          config: JSON.stringify(payload.config),
          seat,
        })

        responseCallback(renderSuccess(this.toModel(newRepository)))
      })
    } catch (err) {
      responseCallback(
        renderError(err, 'Error on create repository', {
          payload,
        })
      )
    }
  }
}
