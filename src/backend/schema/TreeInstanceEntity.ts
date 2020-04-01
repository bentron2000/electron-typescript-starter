import {
  TreeDefinitionEntity,
  MediaItemEntity,
  ElementDataEntity,
  ElementEntity,
} from '..'
import { v4 as uuid } from 'uuid'
import { path } from 'ramda'

import { Ctx, TreeInstance } from '@models'
import { buildElementData } from '@models/ElementData'

import { FieldValueEntity } from './FieldValueEntity'
import {
  LoupeRealmResponseCallback,
  renderSuccess,
  renderError,
} from '@models/ipc'

export interface TITemplate {
  id: string
  name: string
  definitionId: string
  children: TITemplate[]
  elementDataIds: string[]
}

export class TreeInstanceEntity {
  public static schema: Realm.ObjectSchema = {
    primaryKey: 'id',
    name: 'TreeInstance',
    properties: {
      id: 'string',
      name: 'string',
      parent: {
        type: 'linkingObjects',
        objectType: 'TreeInstance',
        property: 'children',
      },
      definition: {
        type: 'linkingObjects',
        objectType: 'TreeDefinition',
        property: 'instances',
      },
      children: 'TreeInstance[]',
      media: 'MediaItem[]',
      elementData: 'ElementData[]',
      elements: {
        type: 'linkingObjects',
        objectType: 'Element',
        property: 'treeInstanceRelevance',
      },
    },
  }
  public id: string
  public name: string
  public parent: TreeInstanceEntity[]
  public definition: TreeDefinitionEntity[]
  public children: TreeInstanceEntity[]
  public media: MediaItemEntity[]
  public elementData: ElementDataEntity[]
  public elements: ElementEntity[]

  constructor(object: Partial<TreeInstanceEntity> = {}) {
    Object.assign(this, object)
    this.id = object.id || uuid()
    this.name = object.name || 'New instance' // #create below handles this further
  }

  public static toModel(tiEntity: TreeInstanceEntity): TreeInstance {
    return {
      id: tiEntity.id,
      model: 'TreeInstance',
      name: tiEntity.name,
      parentId: path(['id'], tiEntity.parent[0]),
      definitionId: tiEntity.definition[0].id,
      mediaAllowed: tiEntity.definition[0].mediaAllowed,
      children: tiEntity.children.map(TreeInstanceEntity.toModel),
      media: tiEntity.media.map(MediaItemEntity.toModel),
      elements: tiEntity.elements.map(e => e.id),
      elementData: tiEntity.elementData.map(ed => ed.id),
    }
  }

  public static toTemplate(entity: TreeInstanceEntity, _options?: any): TITemplate {
    return {
      id: `template(${entity.id})`,
      name: entity.name,
      definitionId: `template(${entity.definition[0].id})`,
      children: entity.children.map(ti => this.toTemplate(ti)),
      elementDataIds: entity.elementData.map(ed => `template(${ed.id})`),
    }
  }

  public static async get(
    realm: Realm,
    ctx: Ctx,
    id: string,
    responseCallback: LoupeRealmResponseCallback
  ) {
    console.log(`get: dont forget to build out the ctx business...${ctx}`)
    try {
      await realm.write(() => {
        const treeInstance = realm.objectForPrimaryKey<TreeInstanceEntity>(
          'TreeInstance',
          id
        )
        const response = treeInstance
          ? renderSuccess(TreeInstanceEntity.toModel(treeInstance))
          : renderError(null, `Error on get TreeInstance: id=${id} not found`)
        responseCallback(response)
      })
    } catch (e) {
      responseCallback(renderError(e, 'Error on get TreeInstance'))
    }
  }

  public static async create(
    realm: Realm,
    ctx: Ctx,
    payload: TreeInstance,
    responseCallback: LoupeRealmResponseCallback
  ) {
    console.log(`create: dont forget to build out the ctx business...${ctx}`)
    try {
      await realm.write(() => {
        responseCallback(
          renderSuccess(
            TreeInstanceEntity.toModel(this._create(realm, ctx, payload))
          )
        )
      })
    } catch (e) {
      responseCallback(renderError(e, 'Error on create TreeInstance', payload))
    }
  }

  public static async update(
    realm: Realm,
    ctx: Ctx,
    payload: TreeInstance,
    responseCallback: LoupeRealmResponseCallback
  ) {
    // TODO: Check here that the user has permission to update an element (in the current user context)
    console.log(`update: dont forget to build out the ctx business...${ctx}`) // this will do something some day...
    try {
      await realm.write(() => {
        const tiEntity = new TreeInstanceEntity({
          id: payload.id,
          name: payload.name,
        })
        const updatedTi = realm.create<TreeInstanceEntity>(
          'TreeInstance',
          tiEntity,
          true
        )
        responseCallback(renderSuccess(TreeInstanceEntity.toModel(updatedTi)))
      })
    } catch (e) {
      responseCallback(renderError(e, 'Error on update TreeInstance', payload))
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
        this._delete(realm, ctx, ids)
        responseCallback(renderSuccess({ ids }))
      })
    } catch (e) {
      responseCallback(renderError(e, 'Error on delete TreeInstance', { ids }))
    }
  }

  public static syncDelete(realm: Realm, ctx: Ctx, ids: string[]) {
    return this._delete(realm, ctx, ids)
  }

  public static tIEreduce<T>(
    treeInst: TreeInstanceEntity,
    fn: (acc: T, val: TreeInstanceEntity) => T,
    acc: T
  ): T[] {
    const newAcc = fn(acc, treeInst)
    return (treeInst.children.length > 0
      ? treeInst.children.map(child => this.tIEreduce(child, fn, newAcc))
      : [newAcc]
    ).flat()
  }

  public static createFromTemplate(realm: Realm, treeInstances: TITemplate[]) {
    return treeInstances.map(ti =>
      realm.create<TreeInstanceEntity>('TreeInstance', ti)
    )
  }

  private static _create(
    realm: Realm,
    ctx: Ctx,
    payload: TreeInstance,
    parentId?: string | undefined
  ) {
    parentId = parentId || payload.parentId

    const parent = parentId
      ? realm.objectForPrimaryKey<TreeInstanceEntity>('TreeInstance', parentId)
      : undefined

    const definition = realm.objectForPrimaryKey<TreeDefinitionEntity>(
      'TreeDefinition',
      payload.definitionId
    )

    if (parent && definition) {
      // Find relationships before creating a new id (relavant for duplicating - new TI payloads
      // will not have an id)
      const elements = realm
        .objects<ElementEntity>('Element')
        .filtered(`treeInstanceRelevance.id = '${payload.id}'`)

      const elementData =
        payload.elementData && payload.elementData.length
          ? realm
              .objects<ElementDataEntity>('ElementData')
              .filtered(
                payload.elementData.map(id => `id == '${id}'`).join(' OR ')
              )
          : undefined

      // Create TI
      const newTi = realm.create<TreeInstanceEntity>(
        'TreeInstance',
        new TreeInstanceEntity({
          name: payload.id ? payload.name : `New ${definition.name}`,
        })
      )

      // Build relationships
      parent.children.push(newTi)
      definition.instances.push(newTi)
      elements.forEach(el => el.treeInstanceRelevance.push(newTi))

      // TODO: [LAD-182] A corresponding ED must be made for any related element.
      // Note, we need to traverse up the tree and determine any inherited element relevance

      // Handle elementData on duplicate
      if (payload.id) {
        if (elementData) {
          elementData.forEach(ed => {
            // create a new ed pointing to TI for fieldset elements
            if (ed.element[0].isFieldSet) {
              ElementDataEntity.syncCreate(
                realm,
                ctx,
                buildElementData({
                  id: '',
                  name: newTi.name,
                  value: ed.value || '',
                  treeInstanceIds: [newTi.id],
                  elementId: ed.element[0].id,
                  fields: ed.fields.map(f => FieldValueEntity.toModel(f)),
                })
              )
            } else {
              // update ed tis with this TI
              newTi.elementData.push(ed)
            }
          })
        }
      }

      // Create children TIs
      if (payload.children && payload.children.length) {
        payload.children.forEach(child =>
          this._create(realm, ctx, child, newTi.id)
        )
      }

      return newTi
    } else {
      throw new Error('Error on create TreeInstance: no parent and td')
    }
  }

  private static _delete(realm: Realm, ctx: Ctx, ids: string[]) {
    const instances = realm
      .objects<TreeInstanceEntity>('TreeInstance')
      .filtered(ids.map(id => `id == '${id}'`).join(' OR '))

    // Cleanup linked objects
    instances.forEach(instance => {
      // TODO: add syncDelete method on MediaItemEntity
      instance.media.forEach(mediaItem => {
        mediaItem.states.forEach(state => realm.delete(state))
        realm.delete(mediaItem)
      })
      ElementDataEntity.syncDelete(
        realm,
        ctx,
        instance.elementData.map(ed => ed.id)
      )
    })
    realm.delete(instances)
  }
}
