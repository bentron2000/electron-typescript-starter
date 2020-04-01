import { v4 as uuid } from 'uuid'
import { ipcRenderer, Event } from 'electron'

import {
  ProjectEntity,
  StagePermissionEntity,
  SectionPermissionEntity,
  SectionEntity,
  MediaStateEntity,
  StageTransitionEntity,
  SeatEntity,
  PendingAssetEntity,
  SubscriptionEntity,
  RepositoryEntity,
} from '@backend'
import {
  LoupeRealmResponse,
  renderSuccess,
  renderError,
  ipcReply,
} from '@models/ipc'
import { Ctx, Stage, PendingAsset } from '@models'
import { INewTemplateEntities } from './TemplateEntity'

export interface StageTemplate {
  id: string
  name: string
  type: string
  inputsAllowed: boolean
  outputsAllowed: boolean
  inputIds: string[]
  outputIds: string[]
  sectionPermissionIds: string[]
  diagramConfig?: string | null
}

export class StageEntity {
  public static schema: Realm.ObjectSchema = {
    primaryKey: 'id',
    name: 'Stage',
    properties: {
      id: 'string',
      name: 'string',
      project: {
        type: 'linkingObjects',
        objectType: 'Project',
        property: 'stages',
      },
      stagePermissions: {
        type: 'linkingObjects',
        objectType: 'StagePermission',
        property: 'stage',
      },
      subscriptions: 'Subscription[]',
      sectionPermissions: 'SectionPermission[]',
      mediaStates: 'MediaState[]',
      inputsAllowed: 'bool',
      inputs: 'StageTransition[]',
      outputsAllowed: 'bool',
      outputs: 'StageTransition[]',
      diagramConfig: 'string?',
      type: 'string',
    },
  }
  public id: string
  public name: string
  public type: string
  public project: ProjectEntity
  public stagePermissions?: StagePermissionEntity[]
  public sectionPermissions: SectionPermissionEntity[]
  public subscriptions: SubscriptionEntity[]
  public mediaStates: MediaStateEntity[]
  public inputsAllowed: boolean
  public inputs: StageTransitionEntity[]
  public outputsAllowed: boolean
  public outputs: StageTransitionEntity[]
  public diagramConfig?: string

  constructor(object: Partial<StageEntity> = {}) {
    Object.assign(this, object)
    this.id = object.id || uuid()
    this.name = object.name || 'New Stage'
  }

  public static toModel(entity: StageEntity): Stage {
    return {
      id: entity.id,
      model: 'Stage',
      name: entity.name,
      type: entity.type,
      projectId: entity.project[0].id,
      sectionIds: entity.sectionPermissions.map(sp => sp.section.id),
      mediaStates: entity.mediaStates.map(MediaStateEntity.toModel),
      inputsAllowed: entity.inputsAllowed,
      inputs: entity.inputs.map(StageTransitionEntity.toModel),
      outputsAllowed: entity.outputsAllowed,
      outputs: entity.outputs.map(StageTransitionEntity.toModel),
      diagramConfig: entity.diagramConfig,
      repositories: entity.subscriptions.map(sub =>
        RepositoryEntity.toModel(sub.repository)
      ),
    }
  }

  public static toTemplate(entity: StageEntity, _options?: any): StageTemplate {
    // subscriptions?
    return {
      id: `template(${entity.id})`,
      name: entity.name,
      type: entity.type,
      inputsAllowed: entity.inputsAllowed,
      outputsAllowed: entity.outputsAllowed,
      inputIds: entity.inputs.map(i => `template(${i.id})`),
      outputIds: entity.outputs.map(o => `template(${o.id})`),
      sectionPermissionIds: entity.sectionPermissions.map(
        sp => `template(${sp.id})`
      ),
      diagramConfig: entity.diagramConfig,
    }
  }

  public static async getByProjectId(
    realm: Realm,
    ctx: Ctx,
    projectId: string,
    setterCallback: (stages: Stage[]) => void
  ) {
    // TODO: Check here that the user has permission  (in the current user context)
    console.log(`update: dont forget to build out the ctx business...${ctx}`) // this will do something some day...

    const seatId = ctx && ctx.id
    const results = ((await realm
      .objects('Stage')
      .filtered(
        `project.id = '${projectId}' && stagePermissions.seat.id = '${seatId}'`
      )) as unknown) as Realm.Results<StageEntity>

    results.addListener(collection => {
      const newStages = collection.map(StageEntity.toModel)
      console.log('Updated current project stages collection')
      setterCallback(newStages) // new query - unsub from old, subscribe to new...
    })
    return () => results.removeAllListeners() //  a method to unsubscribe later
  }

  public static async getPendingAssets(
    realm: Realm,
    ctx: Ctx,
    stageId: string,
    setterCallback: (
      pendingAssets: PendingAsset[],
      unsubscribeFunction?: () => void
    ) => void
  ) {
    // TODO: Check here that the user has permission  (in the current user context)
    console.log(`update: dont forget to build out the ctx business...${ctx}`) // this will do something some day...
    const results = ((await realm
      .objects('PendingAsset')
      .filtered(`stage.id = '${stageId}'`)) as unknown) as Realm.Results<
      PendingAssetEntity
    >
    results.addListener(collection => {
      const newPA = collection.map(PendingAssetEntity.toModel)
      console.log('Updated pending assets collection')
      setterCallback(newPA)
    })
    return () => results.removeAllListeners() //  a method to unsubscribe later
  }

  public static async create(
    realm: Realm,
    ctx: Ctx,
    payload: Stage,
    responseCallback: (response: LoupeRealmResponse) => void,
    args: { projectId: string }
  ) {
    // Does the user have permissions to do this? (do they have an admin permission on this project?)
    const projectId = args.projectId
    const isProjectAdmin =
      ctx &&
      ctx.projectPermissions.filter(pp => pp.project.id === projectId).length >
        0

    if (isProjectAdmin) {
      try {
        await realm.write(() => {
          // get the project from realm
          const project = realm
            .objects<ProjectEntity>('Project')
            .filtered(`id = '${projectId}'`)[0]

          // get other admins from the project
          const projectAdmins = realm
            .objects<SeatEntity>('Seat')
            .filtered(
              `projectPermissions.admin = true && projectPermissions.project.id = '${projectId}'`
            )

          const sections =
            payload.sectionIds && payload.sectionIds.length
              ? realm
                  .objects<SectionEntity>('Section')
                  .filtered(
                    payload.sectionIds.map(id => `id == '${id}'`).join(' OR ')
                  )
              : undefined

          const newStage = realm.create<StageEntity>(
            'Stage',
            new StageEntity({
              ...payload,
              id: uuid(),
              inputs: [],
              outputs: [],
              mediaStates: [],
              diagramConfig:
                payload.id && payload.diagramConfig
                  ? this.dupeDiagramConfig(payload.diagramConfig)
                  : payload.diagramConfig,
            })
          )

          // Push the new stage into the project.stage array
          project.stages.push(newStage)

          projectAdmins.map(pa => {
            // Create stage permissions for every admin on the project
            const permission = realm.create<StagePermissionEntity>(
              'StagePermission',
              {
                id: uuid(),
                stage: newStage,
                seat: pa,
              }
            )

            // and push them onto the seats.stagePermissions array
            pa.stagePermissions.push(permission)
          })

          // Relate to stage to sections
          if (sections) {
            this.setSectionPermissions(sections, newStage)
          }

          // TODO: duplicate media states

          responseCallback(renderSuccess(StageEntity.toModel(newStage)))
        })
      } catch (e) {
        responseCallback(
          renderError(e, 'Error on create section stages', payload)
        )
      }
    } else {
      responseCallback(
        renderError(
          null,
          'You do not have permission to create a Stage',
          payload
        )
      )
    }
  }

  public static async update(
    realm: Realm,
    ctx: Ctx,
    payload: Stage,
    responseCallback: (response: LoupeRealmResponse) => void
  ) {
    // Does the user have permissions to do this? (do they have an admin permission on this project?)
    const isProjectAdmin =
      ctx &&
      ctx.projectPermissions.filter(pp => pp.project.id === payload.projectId)
        .length > 0

    if (isProjectAdmin) {
      // we need to check values or do other checking here no?
      try {
        await realm.write(() => {
          // Update the stage
          const stage = realm.create<SectionEntity>(
            'Stage',
            new StageEntity({
              id: payload.id,
              name: payload.name,
              diagramConfig: payload.diagramConfig,
            }),
            true
          )

          const allStageSections = stage.sectionPermissions.map(
            sp => sp.section
          )

          const secPerms = realm
            .objects<SectionPermissionEntity>('SectionPermission')
            .filtered(`@links.Stage.sectionPermissions.id == '${stage.id}'`)

          if (payload.sectionIds.length) {
            // Remove section permissions for sections that are not included anymore
            const idsQuery = payload.sectionIds
              .map(sectionId => `section.id != '${sectionId}'`)
              .join(' AND ')
            const secPermsToDelete = secPerms.filtered(idsQuery)
            realm.delete(secPermsToDelete)

            // Create section permissions that don't already exist
            const relSections = realm
              .objects<SectionEntity>('Section')
              .filtered(
                payload.sectionIds.map(id => `id == '${id}'`).join(' OR ')
              )
            relSections.forEach(section => {
              if (secPerms.filtered(`section.id = '${section.id}'`).isEmpty()) {
                stage.sectionPermissions.push(
                  new SectionPermissionEntity({
                    id: uuid(),
                    section,
                  })
                )
              }
            })
          } else if (allStageSections.length) {
            // Delete all stage sec perms for project sections
            const idsQuery = allStageSections
              .map(section => `section.id == '${section.id}'`)
              .join(' OR ')
            realm.delete(secPerms.filtered(idsQuery))
          }
          responseCallback(renderSuccess(payload))
        })
      } catch (e) {
        responseCallback(
          renderError(e, 'Error on update section stages', payload)
        )
      }
    } else {
      responseCallback(
        renderError(
          null,
          'You do not have permission to update a Stage',
          payload
        )
      )
    }
  }

  public static async delete(
    realm: Realm,
    ctx: Ctx,
    ids: string[],
    responseCallback: (response: LoupeRealmResponse) => void,
    args: { projectId: string }
  ) {
    // TODO: Determine what other entities will require adjustment when a stage is removed. e.g. activity etc..
    // Perhaps we never delete stages they simply get marked as 'deleted'?
    // Just Deleting for now...
    const projectId = args.projectId
    // Does the user have permissions to do this? (do they have an admin permission on this project?)
    const isProjectAdmin =
      ctx &&
      ctx.projectPermissions.filter(pp => pp.project.id === projectId).length >
        0

    if (isProjectAdmin) {
      try {
        await realm.write(() => {
          const stages = realm
            .objects<StageEntity>('Stage')
            .filtered(ids.map(id => `id == '${id}'`).join(' OR '))

          // Clean up relationships
          stages.forEach(stage => {
            const stagePerms = realm
              .objects('StagePermission')
              .filtered(`stage.id = '${stage.id}'`)

            const sectionPerms = realm
              .objects('SectionPermission')
              .filtered(`stage.id = '${stage.id}'`)

            const transitions = realm
              .objects('StageTransition')
              .filtered(
                `sourceStage.id = '${stage.id}' || destinationStage.id = '${stage.id}'`
              )

            realm.delete(stagePerms)
            realm.delete(sectionPerms)
            realm.delete(transitions)
          })
          // Delete stages
          realm.delete(stages)

          responseCallback(renderSuccess({ ids }))
        })
      } catch (e) {
        responseCallback(renderError(e, 'Error deleting stage', { ids, args }))
      }
    } else {
      responseCallback(
        renderError(null, 'You do not have permission to update a Stage', {
          ids,
          args,
        })
      )
    }
  }

  public static registerListeners(realm: Realm) {
    // Stages for Project subscription listener
    ipcRenderer.on(
      'subscribe-to-project-stages',
      async (event: Event, ctx: Ctx, projectId: string) => {
        const sendResult = (stages: Stage[]) => {
          ipcReply(event, 'update-project-stages', stages)
        }
        const unsubscribe = await this.getByProjectId(
          realm,
          ctx,
          projectId,
          sendResult
        )
        // One time event to be called before any new subscription
        ipcRenderer.once('unsubscribe-from-project-stages', () => unsubscribe())
      }
    )
  }

  public static createFromTemplate(
    realm: Realm,
    stages: StageTemplate[],
    newEntities: INewTemplateEntities,
    seat: SeatEntity
  ) {
    const newStages = stages.map(s =>
      realm.create<StageEntity>(
        'Stage',
        {
          ...s,
          inputs: newEntities.transitions.filter(nt =>
            s.inputIds.includes(nt.id)
          ),
          outputs: newEntities.transitions.filter(nt =>
            s.outputIds.includes(nt.id)
          ),
        },
        true
      )
    )
    newEntities.project.stages.push(...newStages)

    // Stage permissions
    seat.stagePermissions.push(
      ...newStages.map(stage => {
        return realm.create<StagePermissionEntity>('StagePermission', {
          id: uuid(),
          stage,
          observe: true,
          interact: true,
        })
      })
    )
    return newStages
  }

  // Relate sections to stage
  private static setSectionPermissions(
    sections: Realm.Results<SectionEntity & Realm.Object>,
    stage: StageEntity
  ) {
    sections.forEach(section => {
      stage.sectionPermissions.push(
        new SectionPermissionEntity({
          id: uuid(),
          section,
        })
      )
    })
  }

  // Set the config so the stage is not precisely on-top of the stage it's been duplicated from
  private static dupeDiagramConfig(config: string) {
    const configJson = JSON.parse(config)
    configJson.x += 50
    configJson.y -= 50
    return JSON.stringify(configJson)
  }
}
