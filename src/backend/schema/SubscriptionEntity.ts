import { Subscription, Ctx } from '@models'
import { RepositoryEntity, StageEntity, SeatEntity } from '..'
import {
  LoupeRealmResponseCallback,
  renderError,
  renderSuccess,
} from '@models/ipc'
import { v4 as uuid } from 'uuid'

export class SubscriptionEntity {
  public static schema: Realm.ObjectSchema = {
    primaryKey: 'id',
    name: 'Subscription',
    properties: {
      id: 'string',
      repository: 'Repository',
      stage: {
        type: 'linkingObjects',
        objectType: 'Stage',
        property: 'subscriptions',
      },
      // Permissions for subscriptions live here. read/write etc...
    },
  }
  public id: string
  public repository: RepositoryEntity
  public stage: StageEntity[]

  public static toModel(entity: SubscriptionEntity): Subscription {
    return {
      id: entity.id,
      model: 'Subscription',
      repository: RepositoryEntity.toModel(entity.repository),
      stage: StageEntity.toModel(entity.stage[0]),
    }
  }

  public static create(
    realm: Realm,
    ctx: Ctx,
    payload: Subscription,
    responseCallback: LoupeRealmResponseCallback
  ) {
    const die = (message: string) =>
      responseCallback(renderError(message, 'Could not create subscription'))

    if (!ctx) {
      die('no ctx given')
      return
    }

    try {
      realm.write(() => {
        const seat = realm.objectForPrimaryKey<SeatEntity>('Seat', ctx.id)

        if (!seat) {
          die('Could not fetch seat')
          return
        }
        const repository = realm.objectForPrimaryKey<RepositoryEntity>(
          'Repository',
          payload.repository.id
        )
        const stage = realm.objectForPrimaryKey<StageEntity>(
          'Stage',
          payload.stage.id
        )

        if (!repository || !stage) {
          die('Could not find stage or repo')
          return
        }

        // Check for pre-existing sub
        const existingSub = realm
          .objects('Subscription')
          .filtered(
            `repository.id == '${repository.id}' && stage.id == '${stage.id}'`
          )

        if (existingSub.length > 0) {
          throw new Error('Subscription already exists')
        }

        // make a new Subscription
        const newSubscription = realm.create<SubscriptionEntity>(
          'Subscription',
          {
            id: uuid(),
            repository,
          }
        )

        stage.subscriptions.push(newSubscription)

        responseCallback(
          renderSuccess(SubscriptionEntity.toModel(newSubscription))
        )
      })
    } catch (e) {
      responseCallback(
        renderError(e, 'Error on create subscription', { payload })
      )
    }
  }

  public static delete(
    realm: Realm,
    ctx: Ctx,
    ids: string[], // [repository.id, stage.id]
    responseCallback: LoupeRealmResponseCallback
  ) {
    console.log(`delete: dont forget to build out the ctx business...${ctx}`)
    const die = (message: string) =>
      responseCallback(renderError(message, 'Could not delete subscription'))

    if (!ctx) {
      die('no ctx given')
      return
    }

    try {
      realm.write(() => {
        const [repoId, stageId] = ids
        const subscriptions = realm
          .objects<SubscriptionEntity>('Subscription')
          .filtered(`repository.id == '${repoId}' && stage.id == '${stageId}'`)

        realm.delete(subscriptions)

        responseCallback(renderSuccess({ ids }))
      })
    } catch (e) {
      responseCallback(renderError(e, 'Error on delete subscription', { ids }))
    }
  }
}
