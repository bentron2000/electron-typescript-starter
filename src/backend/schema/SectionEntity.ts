import { IpcRendererEvent, ipcRenderer } from 'electron'
import { insert } from 'ramda'
import { v4 as uuid } from 'uuid'

import { Section } from '@models/Section'
import { Ctx } from '@models/Ctx'
import {
  LoupeRealmResponseCallback,
  renderSuccess,
  renderError,
  ipcReply,
} from '@models/ipc'

import { StageEntity } from '@backend/schema/StageEntity'
import { ElementEntity } from '@backend/schema/ElementEntity'
import { SectionPermissionEntity } from '@backend/schema/SectionPermissionEntity'
import { ProjectEntity } from '@backend/schema/ProjectEntity'
import { ProjectPermissionEntity } from '@backend/schema/ProjectPermissionEntity'
import { INewTemplateEntities } from '@backend/schema/TemplateEntity'

export interface SectionTemplate {
  id: string
  name: string
  elementIds: string[]
  elementsOrder: string[]
}

export class SectionEntity {
  public static schema: Realm.ObjectSchema = {
    primaryKey: 'id',
    name: 'Section',
    properties: {
      id: 'string',
      name: 'string',
      sectionPermissions: {
        type: 'linkingObjects',
        objectType: 'SectionPermission',
        property: 'section',
      },
      elements: 'Element[]',
      elementsOrder: 'string[]',
      project: 'Project',
    },
  }
  public id: string
  public name: string
  public sectionPermissions: SectionPermissionEntity[] = []
  public elements: ElementEntity[] = []
  public elementsOrder: string[] = []
  public project: ProjectEntity

  public static toModel(entity: SectionEntity): Section {
    return {
      id: entity.id,
      model: 'Section',
      name: entity.name,
      stageIds: entity.sectionPermissions
        .map(sp => sp.stage.map(s => s.id))
        .flat(),
      elements: entity.elements.map(ElementEntity.toModel),
      elementsOrder: entity.elementsOrder.map(e => e),
      projectId: entity.project.id,
    }
  }

  public static toTemplate(
    entity: SectionEntity,
    _options?: any
  ): SectionTemplate {
    // subscriptions?
    return {
      id: `template(${entity.id})`,
      name: entity.name,
      elementIds: entity.elements.map(e => `template(${e.id})`),
      elementsOrder: entity.elementsOrder.map(eo => `template(${eo})`),
    }
  }

  public static async create(
    realm: Realm,
    ctx: Ctx,
    payload: Section,
    responseCallback: LoupeRealmResponseCallback,
    args: { projectId: string; positionIndex?: number }
  ) {
    // Check here that the user has permission to create a section (in the current user context)
    console.log(`create: dont forget to build out the ctx business...${ctx}`) // this will do something some day...
    try {
      await realm.write(() => {
        // Creating a section.
        // We need to get the project that we are working on.
        const project = realm
          .objects<ProjectEntity>('Project')
          .filtered(`id = '${args.projectId}'`)[0]

        if (!project) {
          throw new Error('Error on create section: no current project')
        }

        // get the stages for this project
        const stages = realm
          .objects<StageEntity>('Stage')
          .filtered(`project.id = '${args.projectId}'`)

        // make a new section
        const newSection = realm.create<SectionEntity>('Section', {
          ...payload,
          id: uuid(),
          elements: [],
          elementsOrder: [],
          project,
        })

        // determine the sections position
        const existingPosition = project.sectionsOrder.findIndex(
          id => id === payload.id
        )
        const newPosition =
          args.positionIndex != null
            ? // at the given position
              args.positionIndex
            : // position below the position of the section being duplicated
            existingPosition >= 0
            ? existingPosition + 1
            : // position at the end of the list
              project.sectionsOrder.length

        // Duplicate section relationships
        if (payload.id) {
          // Duplicate section stage attributions
          if (payload.stageIds.length) {
            this.setStages(
              stages.filtered(
                payload.stageIds
                  .map(stageId => `id == '${stageId}'`)
                  .join(' OR ')
              ),
              newSection
            )
          }
          if (payload.elements.length) {
            this.duplicateElements(realm, ctx, payload, newSection)
          }
        } else {
          // make perms for every stage in the workflow
          this.setStages(stages, newSection)
        }

        // make perms for project admin seats
        // NOTE: consider for admin updates (users assigned / removed the admin role)
        const projectPerms = realm
          .objects<ProjectPermissionEntity>('ProjectPermission')
          .filtered(`admin = true AND project.id == '${project.id}'`)

        projectPerms.map(pp => {
          const seat = pp.seat[0]
          seat.sectionPermissions.push({
            id: uuid(),
            section: newSection,
            stage: [],
            seat: [],
          })
        })

        // update the sections order on the project
        project.sectionsOrder = insert(
          newPosition,
          newSection.id,
          project.sectionsOrder
        )

        responseCallback(renderSuccess(SectionEntity.toModel(newSection)))
      })
    } catch (e) {
      responseCallback(
        renderError(e, 'Error on create section', { payload, args })
      )
    }
  }

  public static async update(
    realm: Realm,
    ctx: Ctx,
    payload: Section,
    responseCallback: LoupeRealmResponseCallback
  ) {
    // TODO: Check here that the user has permission to update an section
    console.log(`update: dont forget to build out the ctx business...${ctx}`)
    try {
      await realm.write(() => {
        // Update the section
        const section = realm.create<SectionEntity>('Section', payload, true)
        const project = realm
          .objects<ProjectEntity>('Project')
          .filtered(`stages.sectionPermissions.section.id == '${section.id}'`)
        const secPerms = realm
          .objects<SectionPermissionEntity>('SectionPermission')
          .filtered(`section.id = '${section.id}'`)

        if (payload.stageIds.length) {
          // Remove section permissions for stages that are not included anymore
          const idsQuery = payload.stageIds
            .map(
              stageId => `@links.Stage.sectionPermissions.id != '${stageId}'`
            )
            .join(' AND ')
          const secPermsToDelete = secPerms.filtered(idsQuery)
          realm.delete(secPermsToDelete)

          // Create section permissions that don't already exist
          const stages = realm
            .objects<StageEntity>('Stage')
            .filtered(payload.stageIds.map(id => `id == '${id}'`).join(' OR '))
          stages.forEach(stage => {
            if (
              secPerms
                .filtered(`@links.Stage.sectionPermissions.id == '${stage.id}'`)
                .isEmpty()
            ) {
              stage.sectionPermissions.push(
                new SectionPermissionEntity({
                  id: uuid(),
                  section,
                  // TODO: no stage or seat?
                })
              )
            }
          })
        } else if (!project.isEmpty() && project[0].stages.length) {
          // Delete all section sec perms for project stages
          const idsQuery = project[0].stages
            .map(stage => `@links.Stage.sectionPermissions.id == '${stage.id}'`)
            .join(' OR ')
          realm.delete(secPerms.filtered(idsQuery))
        } else {
          responseCallback(
            renderError(
              'Project is empty',
              'Error on update section stages',
              payload
            )
          )
        }
        responseCallback(renderSuccess(payload))
      })
    } catch (e) {
      responseCallback(renderError(e, 'Error on update section', payload))
    }
  }

  public static async delete(
    realm: Realm,
    ctx: Ctx,
    ids: string[],
    responseCallback: LoupeRealmResponseCallback
  ) {
    console.log(`delete: dont forget to build out the ctx business...${ctx}`)
    try {
      await realm.write(() => {
        const sections = realm
          .objects<SectionEntity>('Section')
          .filtered(ids.map(id => `id == '${id}'`).join(' OR '))

        sections.forEach(section => {
          const sectionPerms = realm
            .objects('SectionPermission')
            .filtered(`section.id = '${section.id}'`)

          realm.delete(sectionPerms)
          ElementEntity.syncDelete(
            realm,
            ctx,
            section.elements.map(el => el.id)
          )
        })
        realm.delete(sections)

        responseCallback(renderSuccess({ ids }))
      })
    } catch (e) {
      responseCallback(renderError(e, 'Error on delete section', { ids }))
    }
  }

  public static async getByProjectId(
    realm: Realm,
    ctx: Ctx,
    projectId: string,
    setterCallback: (sections: Section[]) => void
  ) {
    // TODO: Check here that the user has permission (in the current user context)
    console.log(`update: dont forget to build out the ctx business...${ctx}`) // this will do something some day...
    const seatId = ctx && ctx.id
    const results = ((await realm
      .objects('Section')
      .filtered(
        `(sectionPermissions.stage.project.id = '${projectId}' && sectionPermissions.stage.stagePermissions.seat.id = '${seatId}') || (project.id = '${projectId}' && sectionPermissions.seat.id = '${seatId}')`
      )) as unknown) as Realm.Results<SectionEntity>

    results.addListener(collection => {
      console.log('Sections collection updated')
      setterCallback(collection.map(SectionEntity.toModel))
    })
    return () => results.removeAllListeners() //  a method to unsubscribe later
  }

  public static registerListeners(realm: Realm) {
    // Sections for Project subscription listener
    ipcRenderer.on(
      'subscribe-to-project-sections',
      async (event: IpcRendererEvent, ctx: Ctx, projectId: string) => {
        const sendResponse = (sections: Section[]) => {
          ipcReply(event, 'update-project-sections', sections)
        }
        const unsubscribe = await this.getByProjectId(
          realm,
          ctx,
          projectId,
          sendResponse
        )
        // One time event to be called before any new subscription
        ipcRenderer.once('unsubscribe-from-project-sections', () =>
          unsubscribe()
        )
      }
    )
  }

  public static createFromTemplate(
    realm: Realm,
    sections: SectionTemplate[],
    newEntities: INewTemplateEntities
  ) {
    return sections.map(s =>
      realm.create<SectionEntity>('Section', {
        ...s,
        elements: newEntities.elements.filter(e => s.elementIds.includes(e.id)),
        project: newEntities.project,
      })
    )
  }

  private static duplicateElements(
    realm: Realm,
    ctx: Ctx,
    oldSection: Section,
    newSection: SectionEntity
  ) {
    oldSection.elements.forEach((element, idx) => {
      ElementEntity.syncCreate(
        realm,
        ctx,
        { ...element, sectionId: newSection.id },
        { positionIndex: idx }
      )
    })
  }

  private static setStages(
    stages: Realm.Results<StageEntity & Realm.Object>,
    section: SectionEntity
  ) {
    stages.map(stage =>
      stage.sectionPermissions.push(
        new SectionPermissionEntity({
          id: uuid(),
          section,
        })
      )
    )
  }
}
