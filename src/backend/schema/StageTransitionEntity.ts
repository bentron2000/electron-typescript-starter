import { v4 as uuid } from 'uuid'
import { Stage, Ctx, StageTransition } from '@models'
import {
  LoupeRealmResponseCallback,
  renderSuccess,
  renderError,
} from '@models/ipc'

import { StageEntity } from '..'

export interface StageTransitionTemplate {
  id: string
  name: string
  sourceStageId: string
  destinationStageId: string
}

export class StageTransitionEntity {
  public static schema: Realm.ObjectSchema = {
    primaryKey: 'id',
    name: 'StageTransition',
    properties: {
      id: 'string',
      name: 'string',
      sourceStage: {
        type: 'linkingObjects',
        objectType: 'Stage',
        property: 'outputs',
      },
      destinationStage: {
        type: 'linkingObjects',
        objectType: 'Stage',
        property: 'inputs',
      },
    },
  }
  public id: string
  public name: string
  public sourceStage: Stage
  public destinationStage: Stage

  public static toModel(entity: StageTransitionEntity): StageTransition {
    return {
      id: entity.id,
      model: 'StageTransition',
      name: entity.name,
      sourceStageId: entity.sourceStage[0].id,
      destinationStageId: entity.destinationStage[0].id,
    }
  }

  public static toTemplate(
    entity: StageTransitionEntity,
    _options?: any
  ): StageTransitionTemplate {
    // subscriptions?
    return {
      id: `template(${entity.id})`,
      name: entity.name,
      sourceStageId: `template(${entity.sourceStage[0].id})`,
      destinationStageId: `template(${entity.destinationStage[0].id})`,
    }
  }

  public static async create(
    realm: Realm,
    ctx: Ctx,
    payload: StageTransition,
    responseCallback: LoupeRealmResponseCallback,
    { projectId }: { projectId: string }
  ) {
    // Does the user have permissions to do this? (do they have an admin permission on this project?)
    const isProjectAdmin =
      ctx &&
      ctx.projectPermissions.filter(pp => pp.project.id === projectId).length >
        0

    if (isProjectAdmin) {
      try {
        await realm.write(() => {
          const st = this._create(realm, ctx, payload)
          responseCallback(renderSuccess(StageTransitionEntity.toModel(st)))
        })
      } catch (e) {
        responseCallback(
          renderError(e, 'Error create stage transition', payload)
        )
      }
    } else {
      responseCallback(
        renderError(
          null,
          'You do not have permission to create stage transitions',
          payload
        )
      )
    }
  }

  public static syncCreate(realm: Realm, ctx: Ctx, transition: StageTransition) {
    return this._create(realm, ctx, transition)
  }

  public static async update(
    realm: Realm,
    ctx: Ctx,
    payload: StageTransition,
    responseCallback: LoupeRealmResponseCallback
  ) {
    console.log('unhandled ctx ...', ctx)
    try {
      await realm.write(() => {
        const trans = {
          id: payload.id,
          name: payload.name,
          sourceStageId: payload.sourceStageId,
          destinationStageId: payload.destinationStageId,
        }
        const updatedTrans = realm.create<StageTransitionEntity>(
          'StageTransition',
          trans,
          true
        )
        responseCallback(
          renderSuccess(StageTransitionEntity.toModel(updatedTrans))
        )
      })
    } catch (e) {
      responseCallback(
        renderError(e, 'Error on update Stage Transition', payload)
      )
    }
  }

  public static async delete(
    realm: Realm,
    ctx: Ctx,
    id: string,
    responseCallback: LoupeRealmResponseCallback,
    { projectId }: { projectId: string }
  ) {
    // TODO: Determine what other entities will require adjustment when a stageTransition is removed. e.g. activity etc..
    // Perhaps we never delete transitions they simply get marked as 'deleted'?
    // Just Deleting for now...
    // Does the user have permissions
    const isProjectAdmin =
      ctx &&
      ctx.projectPermissions.filter(pp => pp.project.id === projectId).length >
        0

    if (isProjectAdmin) {
      try {
        await realm.write(() => {
          const transition = realm
            .objects('StageTransition')
            .filtered(`id = '${id}'`)
          realm.delete(transition)

          responseCallback(renderSuccess({ id }))
        })
      } catch (e) {
        responseCallback(
          renderError(e, 'Error on delete Stage Transition', { id })
        )
      }
    } else {
      responseCallback(
        renderError(
          null,
          'You do not have permission to delete stage transitions',
          { id }
        )
      )
    }
  }

  public static createFromTemplate(
    realm: Realm,
    transitions: StageTransitionTemplate[]
  ) {
    return transitions.map(t =>
      realm.create<StageTransitionEntity>('StageTransition', t)
    )
  }

  private static _create(realm: Realm, _ctx: Ctx, transition: StageTransition) {
    // get the stages from realm
    const sourceStage = realm
      .objects<StageEntity>('Stage')
      .filtered(`id = '${transition.sourceStageId}'`)[0]

    const destStage = realm
      .objects<StageEntity>('Stage')
      .filtered(`id = '${transition.destinationStageId}'`)[0]

    const params = {
      ...transition,
      id: uuid(),
      inputs: [],
      outputs: [],
    }

    const newTransition = realm.create<StageTransitionEntity>(
      'StageTransition',
      params
    )

    // Add the transition to the source and destination stages
    sourceStage.outputs.push(newTransition)
    destStage.inputs.push(newTransition)

    return newTransition
  }
}
