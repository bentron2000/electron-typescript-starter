import * as Realm from 'realm'
import { IpcRendererEvent, ipcRenderer } from 'electron'
import { Project, NewProjectOptions } from '@models/Project'
import { Ctx } from '@models/Ctx'
import { v4 as uuid } from 'uuid'

import { TeamEntity } from '@backend/schema/TeamEntity'
import { StageEntity } from '@backend/schema/StageEntity'
import { ProjectPermissionEntity } from '@backend/schema/ProjectPermissionEntity'
import { TreeDefinitionEntity } from '@backend/schema/TreeDefinitionEntity'
import { TreeInstanceEntity } from '@backend/schema/TreeInstanceEntity'
import { SeatEntity } from '@backend/schema/SeatEntity'
import { SectionEntity } from '@backend/schema/SectionEntity'
import { TemplateEntity, Template } from '@backend/schema/TemplateEntity'
import { StageTransitionEntity } from '@backend/schema/StageTransitionEntity'
import { ElementEntity } from '@backend/schema/ElementEntity'
import { FieldDefinitionEntity } from '@backend/schema/FieldDefinitionEntity'
import { SectionPermissionEntity } from '@backend/schema/SectionPermissionEntity'
import { buildNewTemplateEntities } from '@backend/schema/TemplateEntity'

import {
  LoupeRealmResponseCallback,
  renderSuccess,
  renderError,
  ipcReply,
} from '@models/ipc'

export class ProjectEntity {
  public static schema: Realm.ObjectSchema = {
    primaryKey: 'id',
    name: 'Project',
    properties: {
      id: 'string',
      name: 'string',
      team: {
        type: 'linkingObjects',
        objectType: 'Team',
        property: 'projects',
      },
      stages: 'Stage[]',
      projectPermissions: {
        type: 'linkingObjects',
        objectType: 'ProjectPermission',
        property: 'project',
      },
      treeDefinitions: 'TreeDefinition[]',
      sectionsOrder: 'string[]',
      sections: {
        type: 'linkingObjects',
        objectType: 'Section',
        property: 'project',
      },
    },
  }
  public id: string
  public name: string
  public team: TeamEntity
  public stages: StageEntity[]
  public projectPermissions: ProjectPermissionEntity[]
  public treeDefinitions: TreeDefinitionEntity[]
  public sectionsOrder: string[]
  public sections: SectionEntity[]

  public static toModel(entity: ProjectEntity): Project {
    return {
      id: entity.id,
      name: entity.name,
      model: 'Project',
      teamId: entity.team[0].id,
      sectionsOrder: entity.sectionsOrder.map(so => so),
    }
  }

  public static async create(
    realm: Realm,
    ctx: Ctx,
    options: NewProjectOptions,
    responseCallback: LoupeRealmResponseCallback,
    templateData?: Template // optionally supply a pre-existing template to build
  ) {
    // Check here that the user has permission to create a project
    console.log(`create project: TODO - build out the ctx business...${ctx}`) // this will do something some day...
    try {
      await realm.write(() => {
        if (!ctx) {
          throw new Error(
            'Error on create project: No current context provided'
          )
        }
        const seat = realm.objectForPrimaryKey('Seat', ctx.id) as SeatEntity

        const team = realm.objectForPrimaryKey(
          'Team',
          ctx.team.id
        ) as TeamEntity

        if (!team) {
          throw new Error(
            'Error on create project: Could not find team for seat'
          )
        }

        // Proceed only if we're an admin on the team
        if (!team.admins.map(a => a.id).includes(ctx.id)) {
          throw new Error(
            'Error on create project: You are not an admin on this team.'
          )
        }

        const template = templateData
          ? templateData // if we're given a pre-existing Template to use...
          : this.generateTemplateFromOptions(realm, options, team)

        const hasTemplate = (templateType: keyof Template) =>
          template[templateType].length > 0 ? true : false

        // Project
        const newProject = this.createProject(
          realm,
          team,
          options.name || 'New Project'
        )
        const newEntities = buildNewTemplateEntities(newProject)

        // Project Permissions
        ProjectPermissionEntity.createFromTemplate(realm, seat, newEntities)

        // Stage Transitions
        if (hasTemplate('transitions')) {
          newEntities.transitions = StageTransitionEntity.createFromTemplate(
            realm,
            template.transitions
          )
        }

        // Stages
        if (hasTemplate('stages')) {
          newEntities.stages = StageEntity.createFromTemplate(
            realm,
            template.stages,
            newEntities,
            seat
          )
        }

        // FieldDefinitions
        if (hasTemplate('fieldDefinitions')) {
          newEntities.fieldDefinitions = FieldDefinitionEntity.createFromTemplate(
            realm,
            template.fieldDefinitions
          )
        }

        // Elements
        if (hasTemplate('elements')) {
          newEntities.elements = ElementEntity.createFromTemplate(
            realm,
            template.elements,
            newEntities
          )
        }

        // Sections
        if (hasTemplate('sections')) {
          newEntities.sections = SectionEntity.createFromTemplate(
            realm,
            template.sections,
            newEntities
          )
        }

        // Section Permissions
        newEntities.sectionPermissions = SectionPermissionEntity.createFromTemplate(
          realm,
          template.sectionPermissions,
          newEntities,
          seat
        )

        // Tree Instances
        if (hasTemplate('treeInstances')) {
          newEntities.treeInstances = TreeInstanceEntity.createFromTemplate(
            realm,
            template.treeInstances
          )
        }

        // Tree Definitions
        if (hasTemplate('treeDefinitions')) {
          newEntities.treeDefinitions = TreeDefinitionEntity.createFromTemplate(
            realm,
            template.treeDefinitions,
            newEntities
          )
        }

        responseCallback(renderSuccess(ProjectEntity.toModel(newProject)))
      })
    } catch (e) {
      responseCallback(
        renderError(e, 'Error while creating project', { options })
      )
    }
  }

  public static async getById(
    realm: Realm,
    id: string,
    setterCallback: (project: Project) => void
  ) {
    const results = ((await realm
      .objects('Project')
      .filtered(`id = '${id}'`)) as unknown) as Realm.Results<ProjectEntity>
    results.addListener((collection, _changes) => {
      // TODO: possible optimisation here using 'changes'
      console.log('project updated')
      setterCallback(ProjectEntity.toModel(collection[0]))
    })

    return () => results.removeAllListeners() // a method to unsubscribe later
  }

  public static async getBySeatId(
    realm: Realm,
    seatId: string,
    setterCallback: (projects: Project[]) => void
  ) {
    const results = ((await realm
      .objects('Project')
      .filtered(
        `projectPermissions.seat.id = '${seatId}'`
      )) as unknown) as Realm.Results<ProjectEntity>

    results.addListener((collection, _changes) => {
      // TODO: possible optimisation here using 'changes'
      setterCallback(collection.map(ProjectEntity.toModel)) // new query - unsubs from old, subs to new
    })
    return () => results.removeAllListeners() // a method to unsubscribe later
  }

  public static generateTemplateFromOptions(
    realm: Realm,
    options: NewProjectOptions,
    team: TeamEntity
  ) {
    // Process our templates using the blank/empty template to fill in any gaps.

    const blankTemplateEntity = realm.objectForPrimaryKey(
      'Template',
      'blank'
    ) as TemplateEntity
    // Proceed only if we've got at least a valid blank template
    if (!blankTemplateEntity) {
      throw new Error(
        'Error on create project: Could not find a valid template.'
      )
    }

    // Merge the incoming templates together to make the new complete project template
    const briefTemplate = options.briefTemplate
      ? (realm.objectForPrimaryKey(
          'Template',
          options.briefTemplate
        ) as TemplateEntity)
      : blankTemplateEntity
    const treeTemplate = options.treeTemplate
      ? (realm.objectForPrimaryKey(
          'Template',
          options.treeTemplate
        ) as TemplateEntity)
      : blankTemplateEntity
    const workflowTemplate = options.workflowTemplate
      ? (realm.objectForPrimaryKey(
          'Template',
          options.workflowTemplate
        ) as TemplateEntity)
      : blankTemplateEntity

    const combinedTemplate = {
      name: options.name,
      team,
      ...blankTemplateEntity,
      sections: briefTemplate.sections,
      elements: briefTemplate.elements,
      sectionPermissions: briefTemplate.sectionPermissions,
      fieldDefinitions: briefTemplate.fieldDefinitions,
      treeDefinitions: treeTemplate.treeDefinitions,
      treeInstances: treeTemplate.treeInstances,
      stages: workflowTemplate.stages,
      transitions: workflowTemplate.transitions,
    }

    // Generate a version of this Template with new UUIDs
    return TemplateEntity.replaceIds(
      TemplateEntity.entityToObject(combinedTemplate)
    )
  }

  public static registerListeners(realm: Realm) {
    // Projects for seat subscription listener
    ipcRenderer.on(
      'subscribe-to-seat-projects',
      async (event: IpcRendererEvent, ctx: Ctx) => {
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
          ipcRenderer.once('unsubscribe-from-seat-projects', () =>
            unsubscribe()
          )
        }
      }
    )
  }

  private static createProject(
    realm: Realm,
    team: TeamEntity,
    templateName: string
  ) {
    const newProject = realm.create<ProjectEntity>('Project', {
      id: uuid(),
      name: templateName,
    })
    team.projects.push(newProject)
    return newProject
  }
}
