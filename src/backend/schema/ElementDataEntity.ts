import { TreeInstanceEntity, FieldValueEntity, ElementEntity } from '..'
import { v4 as uuid } from 'uuid'
import { Ctx, ElementData } from '../../models'
import {
  LoupeRealmResponseCallback,
  renderSuccess,
  renderError,
} from '@models/ipc'

export class ElementDataEntity {
  public static schema: Realm.ObjectSchema = {
    primaryKey: 'id',
    name: 'ElementData',
    properties: {
      id: 'string',
      name: { type: 'string?', default: undefined },
      value: 'string?',
      treeInstances: {
        type: 'linkingObjects',
        objectType: 'TreeInstance',
        property: 'elementData',
      },
      element: {
        type: 'linkingObjects',
        objectType: 'Element',
        property: 'elementData',
      },
      fields: 'FieldValue[]',
    },
  }
  public id: string
  public name?: string
  public value?: string
  public treeInstances: TreeInstanceEntity[]
  public element: ElementEntity[]
  public fields: FieldValueEntity[]

  constructor(object: Partial<ElementDataEntity> = {}) {
    Object.assign(this, object)
    this.id = object.id || uuid()
    this.name = object.name || 'New Element Data'
    this.value = object.value
  }

  public static toModel(ed: ElementDataEntity): ElementData {
    return {
      id: ed.id,
      model: 'ElementData',
      name: ed.element[0].isFieldSet
        ? ed.treeInstances[0].name
        : ed.element[0].name,
      value: ed.value || '',
      fields: ed.fields.map(f => FieldValueEntity.toModel(f)),
      treeInstanceIds: ed.treeInstances.map(ti => ti.id),
      elementId: ed.element[0].id,
    }
  }

  public static async create(
    realm: Realm,
    ctx: Ctx,
    payload: ElementData,
    responseCallback: LoupeRealmResponseCallback
  ) {
    try {
      await realm.write(() => {
        const edEntity = this._create(realm, ctx, payload)
        responseCallback(renderSuccess(ElementDataEntity.toModel(edEntity)))
      })
    } catch (e) {
      responseCallback(renderError(e, 'Error on create element data', payload))
    }
  }

  public static syncCreate(realm: Realm, ctx: Ctx, payload: ElementData) {
    return this._create(realm, ctx, payload)
  }

  public static async update(
    realm: Realm,
    ctx: Ctx,
    payload: ElementData,
    responseCallback: LoupeRealmResponseCallback
  ) {
    console.log(`update: dont forget to build out the ctx business...${ctx}`)
    try {
      await realm.write(() => {
        const edEntity = realm.create(
          'ElementData',
          new ElementDataEntity({
            id: payload.id,
            name: payload.name,
            value: payload.value,
          }),
          true
        )
        responseCallback(renderSuccess(ElementDataEntity.toModel(edEntity)))
      })
    } catch (e) {
      responseCallback(
        renderError(e, 'Error on update element relevance', payload)
      )
    }
  }

  public static syncDelete(realm: Realm, ctx: Ctx, ids: string[]) {
    return this._delete(realm, ctx, ids)
  }

  private static _create(realm: Realm, ctx: Ctx, payload: ElementData) {
    console.log(`create: dont forget to build out the ctx business...${ctx}`)
    const element = realm.objectForPrimaryKey<ElementEntity>(
      'Element',
      payload.elementId
    )

    const tis = payload.treeInstanceIds.length
      ? realm
          .objects<TreeInstanceEntity>('TreeInstance')
          .filtered(
            payload.treeInstanceIds.map(id => `id == '${id}'`).join(' OR ')
          )
      : undefined
    const fields = payload.fields.length
      ? realm
          .objects<FieldValueEntity>('FieldValue')
          .filtered(
            payload.fields.map(field => `id == '${field.id}'`).join(' OR ')
          )
      : undefined

    const ed = realm.create<ElementDataEntity>(
      'ElementData',
      new ElementDataEntity({
        name: payload.name,
        value: payload.value,
      })
    )
    // Add the ED to the TI and Element
    if (tis) {
      tis.forEach(ti => ti.elementData.push(ed))
    }
    if (element) {
      element.elementData.push(ed)
    }
    if (fields) {
      fields.forEach(async fv => {
        await FieldValueEntity.create(realm, ctx, fv, {
          elementDataId: ed.id,
          fieldDefinitionId: fv.definition[0].id,
        })
      })
    }

    return ed
  }

  private static _delete(realm: Realm, _ctx: Ctx, ids: string[]) {
    if (!ids.length) {
      return ids
    }

    const eds = realm
      .objects<ElementDataEntity>('ElementData')
      .filtered(ids.map(id => `id == '${id}'`).join(' OR '))

    eds.forEach(ed => realm.delete(ed.fields))
    realm.delete(eds)

    return ids
  }
}
