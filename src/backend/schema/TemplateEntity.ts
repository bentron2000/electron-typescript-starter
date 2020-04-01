import { Template, Ctx, SaveTemplatePayload, TemplateInfo } from '@models'
import {
  StageEntity,
  StageTransitionEntity,
  ProjectEntity,
  SectionEntity,
  SectionPermissionEntity,
  ElementEntity,
  FieldDefinitionEntity,
  TreeDefinitionEntity,
  TreeInstanceEntity,
  TeamEntity,
} from '@backend'
import { uniq } from 'ramda'
import { v4 as uuid } from 'uuid'
import * as fs from 'fs'
import { mkDir as mkDirR } from '@utils/Helpers/fsHelpers'
import { RequireAtLeast } from '@helpers/typeScriptHelpers'
import { ipcRenderer, Event } from 'electron'
import {
  LoupeRealmResponseCallback,
  renderError,
  renderSuccess,
} from '@models/ipc'

const TEMPLATE_SAVE_LOCATION = `${__dirname}/../../../templates`

// TODO: we need to consider how to handle dependencies if we allow templates of parts of projects that depend on other parts

export class TemplateEntity {
  public static schema: Realm.ObjectSchema = {
    name: 'Template',
    primaryKey: 'id',
    properties: {
      team: 'Team',
      id: 'string',
      name: 'string',
      stages: 'string?',
      transitions: 'string?',
      sections: 'string?',
      sectionPermissions: 'string?',
      elements: 'string?',
      fieldDefinitions: 'string?',
      treeDefinitions: 'string?',
      treeInstances: 'string?',
    },
  }
  public team: TeamEntity
  public id: string
  public name: string
  public stages?: string
  public transitions?: string
  public sections?: string
  public sectionPermissions?: string
  public elements?: string
  public fieldDefinitions?: string
  public treeDefinitions?: string
  public treeInstances?: string

  public static entityToInfo(template: TemplateEntity): TemplateInfo {
    const t = this.entityToObject(template)
    return {
      team: t.team,
      id: t.id,
      name: t.name,
      stages: t.stages ? t.stages.length : 0,
      transitions: t.transitions ? t.transitions.length : 0,
      sections: t.sections ? t.sections.length : 0,
      sectionPermissions: t.sectionPermissions
        ? t.sectionPermissions.length
        : 0,
      elements: t.elements ? t.elements.length : 0,
      fieldDefinitions: t.fieldDefinitions ? t.fieldDefinitions.length : 0,
      treeDefinitions: t.treeDefinitions ? t.treeDefinitions.length : 0,
      treeInstances: t.treeInstances ? t.treeInstances.length : 0,
    }
  }

  public static entityToObject(entity: TemplateEntity): Template {
    const parseOrEmpty = (str: string | undefined) => {
      return str ? JSON.parse(str) : []
    }

    return {
      team: entity.team.id,
      id: entity.id,
      name: entity.name,
      stages: parseOrEmpty(entity.stages),
      transitions: parseOrEmpty(entity.transitions),
      sections: parseOrEmpty(entity.sections),
      sectionPermissions: parseOrEmpty(entity.sectionPermissions),
      elements: parseOrEmpty(entity.elements),
      fieldDefinitions: parseOrEmpty(entity.fieldDefinitions),
      treeDefinitions: parseOrEmpty(entity.treeDefinitions),
      treeInstances: parseOrEmpty(entity.treeInstances),
    }
  }

  public static templateToEntity(
    template: Template,
    team: TeamEntity
  ): TemplateEntity {
    return {
      team,
      id: template.id,
      name: template.name,
      stages: JSON.stringify(template.stages),
      transitions: JSON.stringify(template.transitions),
      sections: JSON.stringify(template.sections),
      sectionPermissions: JSON.stringify(template.sectionPermissions),
      elements: JSON.stringify(template.elements),
      fieldDefinitions: JSON.stringify(template.fieldDefinitions),
      treeDefinitions: JSON.stringify(template.treeDefinitions),
      treeInstances: JSON.stringify(template.treeInstances),
    }
  }

  public static async create(
    realm: Realm,
    ctx: Ctx,
    options: RequireAtLeast<Partial<SaveTemplatePayload>, 'projectId'>,
    responseCallback: LoupeRealmResponseCallback
  ) {
    const projectEntity = realm.objectForPrimaryKey<ProjectEntity>(
      'Project',
      options.projectId
    )
    if (!projectEntity) {
      responseCallback(
        renderError(
          'Could not fetch project from Realm.',
          'Could not create template.',
          options
        )
      )
      return
    }

    // Context checks required
    if (!ctx) {
      responseCallback(
        renderError(
          'Could not determine context from CTX object.',
          'Could not create template.',
          options
        )
      )
      return
    }

    const team = realm.objectForPrimaryKey<TeamEntity>('Team', ctx.team.id)

    // Context checks required
    if (!team) {
      responseCallback(
        renderError(
          'Could not determine Team from CTX object.',
          'Could not create template.',
          options
        )
      )
      return
    }

    // Workflow: StageEntity, StageTransitionEntity
    const stageTemplates = options.includeStages
      ? projectEntity.stages.map(s => StageEntity.toTemplate(s))
      : []

    const transitionTemplates = options.includeTransitions
      ? uniq(
          projectEntity.stages
            .map(s => [
              ...s.inputs.map(i => StageTransitionEntity.toTemplate(i)),
              ...s.outputs.map(o => StageTransitionEntity.toTemplate(o)),
            ])
            .flat()
        )
      : []

    const sectionTemplates = options.includeSections
      ? projectEntity.sections.map(s => SectionEntity.toTemplate(s))
      : []

    const sectionPermissionTemplates = options.includeSectionPermissions
      ? projectEntity.stages
          .map(s =>
            s.sectionPermissions.map(sp =>
              SectionPermissionEntity.toTemplate(sp)
            )
          )
          .flat()
      : []

    const elementTemplates = options.includeElements
      ? uniq(
          projectEntity.sections
            .map(section =>
              section.elements.map(el => ElementEntity.toTemplate(el))
            )
            .flat()
        )
      : []

    const fieldDefinitionTemplates = options.includeFieldDefinitions
      ? projectEntity.sections
          .map(s =>
            s.elements.map(el =>
              el.fieldDefinitions.map(fd =>
                FieldDefinitionEntity.toTemplate(fd)
              )
            )
          )
          .flat(2)
      : []

    const treeDefinitionTemplates = options.includeTreeDefinitions
      ? [TreeDefinitionEntity.toTemplate(projectEntity.treeDefinitions[0])]
      : []

    const treeInstanceTemplates = options.includeTreeInstances
      ? projectEntity.treeDefinitions[0].instances.map(ti =>
          TreeInstanceEntity.toTemplate(ti)
        )
      : []

    const templateOriginalIds = {
      id: uuid(),
      name: options.name || 'Untitled Template',
      stages: stageTemplates,
      transitions: transitionTemplates,
      sections: sectionTemplates,
      sectionPermissions: sectionPermissionTemplates,
      elements: elementTemplates,
      fieldDefinitions: fieldDefinitionTemplates,
      treeDefinitions: treeDefinitionTemplates,
      treeInstances: treeInstanceTemplates,
    }

    const templateGenericIds = this.replaceIds(templateOriginalIds, true)

    const makeFileName = () => {
      const d = new Date()
      const prefix = options.name ? options.name.replace(' ', '_') + '_' : ''
      return `${prefix}${d.getFullYear()}-${d.getMonth() +
        1}-${d.getDate()}--${d.getHours()}h-${d.getMinutes()}m.loupetemplate`
    }

    await mkDirR(TEMPLATE_SAVE_LOCATION)
    fs.writeFile(
      `${TEMPLATE_SAVE_LOCATION}/${makeFileName()}`,
      JSON.stringify(templateGenericIds, null, 2),
      err => {
        if (err) {
          return console.log(err)
        }
        console.log('The template was saved!')
      }
    )

    try {
      await realm.write(() => {
        const newTemplate = realm.create<TemplateEntity>(
          'Template',
          this.templateToEntity(templateGenericIds, team)
        )
        team.templates.push(newTemplate)
        responseCallback(renderSuccess(this.entityToObject(newTemplate)))
      })
    } catch (error) {
      console.error('Could not save template', error)
      responseCallback(renderError(error, 'Could not save template', options))
    }
  }

  public static registerListeners(realm: Realm, uiWindowId: number) {
    // Import Template Selection Dialog
    ipcRenderer.on(
      'handle-template-file-load',
      (event: Event, teamId: string, data: string, responseChannel: string) => {
        try {
          const template = JSON.parse(data)
          realm.write(() => {
            const team = realm.objectForPrimaryKey<TeamEntity>('Team', teamId)
            if (!team) {
              throw new Error('Could not determine team')
            }
            const newTemplate = realm.create<TemplateEntity>(
              'Template',
              TemplateEntity.templateToEntity({ ...template, id: uuid() }, team)
            )
            team.templates.push(newTemplate)
            ipcRenderer.sendTo(
              uiWindowId,
              responseChannel,
              renderSuccess(TemplateEntity.entityToInfo(newTemplate))
            )
          })
        } catch (error) {
          console.error(error, event)
          ipcRenderer.sendTo(
            uiWindowId,
            responseChannel,
            renderError(error, 'Failed to load template file')
          )
        }
      }
    )
  }

  // Handles template ID replacement for ids wrapped in 'template(xxxx)'
  // Just uses string replacement for now
  public static replaceIds(
    template: Partial<Template>,
    keepTemplate: boolean = false
  ): Template {
    const templateString = JSON.stringify(template)
    const currentIds = [...new Set(templateString.match(/template\(.*?\)/g))]
    const withTemplate = (id: string) => (keepTemplate ? `template(${id})` : id)
    const replacer = (acc: string, cur: string) =>
      acc.split(cur).join(withTemplate(uuid()))
    const out = currentIds.reduce(replacer, templateString)
    return JSON.parse(out) as Template
  }
}

export interface INewTemplateEntities {
  project: ProjectEntity
  stages: StageEntity[]
  transitions: StageTransitionEntity[]
  sections: SectionEntity[]
  sectionPermissions: SectionPermissionEntity[]
  elements: ElementEntity[]
  fieldDefinitions: FieldDefinitionEntity[]
  treeDefinitions: TreeDefinitionEntity[]
  treeInstances: TreeInstanceEntity[]
}

export const buildNewTemplateEntities = (project: ProjectEntity) => {
  return {
    project,
    stages: [],
    transitions: [],
    sections: [],
    sectionPermissions: [],
    elements: [],
    fieldDefinitions: [],
    treeDefinitions: [],
    treeInstances: [],
  } as INewTemplateEntities
}
