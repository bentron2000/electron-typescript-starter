import { ipcRenderer, IpcRendererEvent } from 'electron'
import { v4 as uuid } from 'uuid'
import { path } from 'ramda'

import { TreeDefinition } from '@models/TreeDefinition'
import { Ctx } from '@models/Ctx'

import { ProjectEntity } from '@backend/schema/ProjectEntity'
import { TreeInstanceEntity } from '@backend/schema/TreeInstanceEntity'
import { INewTemplateEntities } from '@backend/schema/TemplateEntity'

import {
  LoupeRealmResponseCallback,
  renderSuccess,
  renderError,
  ipcReply,
} from '@models/ipc'
import {
  tdTemplateReduce,
  templateReducer,
} from '@backend/helpers/templateHelpers'

export interface TDTemplate {
  id: string
  name: string
  instanceIds: string[]
  children: TDTemplate[]
  mediaAllowed: boolean
  collaboratorMode: boolean
  allowedFormats: string[]
}

export class TreeDefinitionEntity {
  public static schema: Realm.ObjectSchema = {
    primaryKey: 'id',
    name: 'TreeDefinition',
    properties: {
      id: 'string',
      name: 'string',
      parent: {
        type: 'linkingObjects',
        objectType: 'TreeDefinition',
        property: 'children',
      },
      project: {
        type: 'linkingObjects',
        objectType: 'Project',
        property: 'treeDefinitions',
      },
      instances: 'TreeInstance[]',
      children: 'TreeDefinition[]',
      mediaAllowed: { type: 'bool', default: false },
      collaboratorMode: { type: 'bool', default: false },
      allowedFormats: { type: 'string[]', default: [] },
    },
  }
  public id: string
  public name: string
  public parent: TreeDefinitionEntity[]
  public project: ProjectEntity[]
  public instances: TreeInstanceEntity[]
  public children: TreeDefinitionEntity[]
  public mediaAllowed: boolean
  public collaboratorMode: boolean
  public allowedFormats: string[]

  constructor(object: Partial<TreeDefinitionEntity> = {}) {
    Object.assign(this, object)
    this.id = object.id || uuid()
    this.name = object.name || 'New definition'
  }

  public static toModel(treeDef: TreeDefinitionEntity): TreeDefinition {
    return {
      id: treeDef.id,
      model: 'TreeDefinition',
      name: treeDef.name,
      parentId: path(['id'], treeDef.parent[0]),
      project: treeDef.project[0].id,
      instances: treeDef.instances.map(ti => TreeInstanceEntity.toModel(ti)),
      children: treeDef.children.map(td => TreeDefinitionEntity.toModel(td)),
      mediaAllowed: treeDef.mediaAllowed,
      collaboratorMode: treeDef.collaboratorMode,
      allowedFormats: treeDef.allowedFormats.map(f => f),
    }
  }

  public static toTemplate(
    entity: TreeDefinitionEntity,
    _options?: any
  ): TDTemplate {
    return {
      id: `template(${entity.id})`,
      name: entity.name,
      instanceIds: entity.instances.map(ti => `template(${ti.id})`),
      children: entity.children.map(td => this.toTemplate(td)),
      mediaAllowed: entity.mediaAllowed,
      collaboratorMode: entity.collaboratorMode,
      allowedFormats: entity.allowedFormats.map(f => f),
    }
  }

  public static async getByProjectId(
    realm: Realm,
    ctx: Ctx,
    projectId: string,
    setterCallback: (rootTD: TreeDefinition, other: any) => void
  ) {
    // TODO: Check here that the user has permission (in the current user context)
    console.log(`update: dont forget to build out the ctx business...${ctx}`) // this will do something some day...
    const results = ((await realm
      .objects('TreeDefinition')
      .filtered(
        `project.id = '${projectId}' && parent.@count == 0`
      )) as unknown) as Realm.Results<TreeDefinitionEntity>
    results.addListener(collection => {
      const rootTD =
        collection.length > 0
          ? TreeDefinitionEntity.toModel(collection[0])
          : undefined
      console.log('subscribed to new Tree Defs')

      if (rootTD) {
        setterCallback(rootTD, collection[0]) // new query - unsubs from old and add it to the new state
      }
    })
    return () => results.removeAllListeners() //  a method to unsubscribe later
  }

  public static async create(
    realm: Realm,
    ctx: Ctx,
    payload: TreeDefinition,
    responseCallback: LoupeRealmResponseCallback
  ) {
    console.log(`create: dont forget to build out the ctx business...${ctx}`)
    try {
      await realm.write(() => {
        const project = realm.objectForPrimaryKey<ProjectEntity>(
          'Project',
          payload.project
        )
        const parentTd = realm.objectForPrimaryKey<TreeDefinitionEntity>(
          'TreeDefinition',
          payload.parentId || ''
        )

        if (!project) {
          throw new Error('Invalid project id')
        }

        if (!parentTd) {
          throw new Error('Invalid parent id')
        }

        if (parentTd.children.length) {
          throw new Error('Tree Definitions can only have 1 child')
        }

        const newTd = realm.create<TreeDefinitionEntity>(
          'TreeDefinition',
          new TreeDefinitionEntity({ name: payload.name })
        )

        project.treeDefinitions.push(newTd)
        parentTd.children.push(newTd)

        responseCallback(renderSuccess(TreeDefinitionEntity.toModel(newTd)))
      })
    } catch (e) {
      responseCallback(
        renderError(e, 'Error on create Tree Definition', payload)
      )
    }
  }

  public static async update(
    realm: Realm,
    ctx: Ctx,
    payload: TreeDefinition,
    responseCallback: LoupeRealmResponseCallback
  ) {
    // TODO: Check here that the user has permission to update an treeDefinition (in the current user context)
    console.log(`update: dont forget to build out the ctx business...${ctx}`) // this will do something some day...
    try {
      await realm.write(() => {
        const tdEnt = new TreeDefinitionEntity({
          id: payload.id,
          name: payload.name,
          mediaAllowed: payload.mediaAllowed,
          collaboratorMode: payload.collaboratorMode,
          allowedFormats: payload.allowedFormats,
        })
        const updatedTd = realm.create('TreeDefinition', tdEnt, true)
        responseCallback(renderSuccess(TreeDefinitionEntity.toModel(updatedTd)))
      })
    } catch (e) {
      responseCallback(
        renderError(e, 'Error on update Tree Definition', payload)
      )
    }
  }

  public static async delete(
    realm: Realm,
    ctx: Ctx,
    ids: string[],
    responseCallback: LoupeRealmResponseCallback
  ) {
    console.log(`create: dont forget to build out the ctx business...${ctx}`)
    try {
      await realm.write(() => {
        const definitions = realm
          .objects<TreeDefinitionEntity>('TreeDefinition')
          .filtered(ids.map(id => `id == '${id}'`).join(' OR '))

        // Cleanup linked objects
        definitions.forEach(definition => {
          if (definition.instances.length) {
            TreeInstanceEntity.syncDelete(
              realm,
              ctx,
              definition.instances.map(ti => ti.id)
            )
          }
        })
        realm.delete(definitions)

        responseCallback(renderSuccess({ ids }))
      })
    } catch (e) {
      responseCallback(
        renderError(e, 'Error on delete TreeDefinition', { ids })
      )
    }
  }

  public static registerListeners(realm: Realm) {
    // Tree for Project subscription listener
    ipcRenderer.on(
      'subscribe-to-project-tree',
      async (event: IpcRendererEvent, ctx: Ctx, projectId: string) => {
        const sendResult = (rootTD: TreeDefinition) => {
          ipcReply(event, 'update-project-tree', rootTD)
        }
        const unsubscribe = await TreeDefinitionEntity.getByProjectId(
          realm,
          ctx,
          projectId,
          sendResult
        )
        // One time event to be called before any new subscription
        ipcRenderer.once('unsubscribe-from-project-tree', () => unsubscribe())
      }
    )
  }

  public static tDEreduce<T>(
    treeDef: TreeDefinitionEntity,
    fn: (acc: T, val: TreeDefinitionEntity) => T,
    acc: T
  ): T[] {
    const newAcc = fn(acc, treeDef)
    return (treeDef.children.length > 0
      ? treeDef.children.map(child => this.tDEreduce(child, fn, newAcc))
      : [newAcc]
    ).flat()
  }

  public static createFromTemplate(
    realm: Realm,
    treeDefinitions: TDTemplate[],
    newEntities: INewTemplateEntities
  ) {
    const newTds = treeDefinitions.map(td =>
      realm.create<TreeDefinitionEntity>('TreeDefinition', td)
    )

    const allInsts = newEntities.treeInstances
      .map(ti =>
        TreeInstanceEntity.tIEreduce(
          ti,
          (acc: TreeInstanceEntity[], val: TreeInstanceEntity) => [...acc, val],
          []
        )
      )
      .flat(2)

    const allDefs = newTds
      .map(td =>
        TreeDefinitionEntity.tDEreduce(
          td,
          (acc: TreeDefinitionEntity[], val: TreeDefinitionEntity) => [
            ...acc,
            val,
          ],
          []
        )
      )
      .flat(2)

    const tdInstanceMap = treeDefinitions
      .map(tdt => tdTemplateReduce(tdt, templateReducer, {})[0])
      .reduce((acc, val) => {
        return { ...acc, ...val }
      })

    // Add the instances to the definitions
    allDefs.map(d => {
      d.instances.push(
        ...allInsts.filter(i => tdInstanceMap[d.id].includes(i.id))
      )
    })

    // Add the definitions to the project
    newEntities.project.treeDefinitions.push(...allDefs)

    return newTds
  }
}
