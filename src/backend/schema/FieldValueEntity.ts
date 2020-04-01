import { FieldDefinitionEntity } from './FieldDefinitionEntity'
import { ElementDataEntity } from '..'
import { v4 as uuid } from 'uuid'
import { FieldValue, Ctx } from '../../models'

export class FieldValueEntity {
  public static schema: Realm.ObjectSchema = {
    primaryKey: 'id',
    name: 'FieldValue',
    properties: {
      id: 'string',
      definition: {
        type: 'linkingObjects',
        objectType: 'FieldDefinition',
        property: 'instances',
      },
      elementData: {
        type: 'linkingObjects',
        objectType: 'ElementData',
        property: 'fields',
      },
      value: 'string?',
    },
  }
  public id: string
  public definition: FieldDefinitionEntity[]
  public elementData: ElementDataEntity[]
  public value: string | undefined

  constructor(object: Partial<FieldValueEntity> = {}) {
    Object.assign(this, object)
    this.id = object.id || uuid()
    this.value = object.value || undefined
  }

  public static toModel(fv: FieldValueEntity): FieldValue {
    return {
      id: fv.id,
      model: 'FieldValue',
      name: fv.definition[0].name,
      definitionId: fv.definition[0].id,
      elementDataId: fv.elementData[0].id,
      value: fv.value || '',
    }
  }

  public static async create(
    realm: Realm,
    ctx: Ctx,
    fieldValue: Partial<FieldValueEntity>,
    args: { elementDataId: string; fieldDefinitionId: string }
  ) {
    // Check here that the user has permission to create a Field Value (in the current user context)
    console.log(`create: dont forget to build out the ctx business...${ctx}`) // this will do something some day...

    if (args.elementDataId && args.fieldDefinitionId) {
      const fd = await realm.objectForPrimaryKey<FieldDefinitionEntity>(
        'FieldDefinition',
        args.fieldDefinitionId
      )
      const ed = await realm.objectForPrimaryKey<ElementDataEntity>(
        'ElementData',
        args.elementDataId
      )
      const fv = new FieldValueEntity({
        value:
          fieldValue && fieldValue.value
            ? fieldValue.value
            : fd
            ? fd.defaultValue
            : undefined,
      })
      if (fd && ed) {
        realm.write(() => {
          const newFV = realm.create('FieldValue', fv)
          fd.instances.push(newFV)
          ed.fields.push(newFV)
        })
      }
    }
    // TODO: return some shiznit
  }

  public static async update(
    realm: Realm,
    ctx: Ctx,
    fieldValue: FieldValue,
    _args: any
  ) {
    // TODO: Check here that the user has permission to update a FieldDefinition (in the current user context)
    console.log(`update: dont forget to build out the ctx business...${ctx}`) // this will do something some day...
    // Update the fieldDefinition...
    realm.write(() => {
      realm.create('FieldValue', fieldValue, true)
    })
  }

  public static async delete(realm: Realm, field: FieldValueEntity) {
    const thisFieldValue = await realm.objectForPrimaryKey<FieldValueEntity>(
      'FieldValue',
      field.id
    )
    if (thisFieldValue) {
      await realm.write(() => {
        realm.delete(thisFieldValue)
      })
    }
    // TODO return values?
  }
}
