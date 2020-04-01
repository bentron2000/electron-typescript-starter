import { v4 as uuid } from 'uuid'
import { FieldDefinition, Ctx } from '@models'
import { RequireAtLeast } from '@helpers/typeScriptHelpers'
import { ElementEntity, FieldValueEntity } from '..'

export interface FieldDefinitionTemplate {
  id: string
  name: string
  type: string
  defaultValue?: string
}

export class FieldDefinitionEntity {
  public static schema: Realm.ObjectSchema = {
    primaryKey: 'id',
    name: 'FieldDefinition',
    properties: {
      id: 'string',
      name: 'string',
      element: {
        type: 'linkingObjects',
        objectType: 'Element',
        property: 'fieldDefinitions',
      },
      type: 'string',
      instances: 'FieldValue[]',
      defaultValue: { type: 'string?', default: undefined },
    },
  }
  public id: string
  public name: string
  public element: ElementEntity[]
  public type: string // later a set of literal strings made up of type names.
  public instances: FieldValueEntity[]
  public defaultValue?: string

  constructor(object: Partial<FieldDefinitionEntity> = {}) {
    Object.assign(this, object)
    this.id = object.id || uuid()
    this.name = object.name || 'New Field'
    this.type = object.type || 'string'
  }

  public static toModel(fd: FieldDefinitionEntity): FieldDefinition {
    return {
      id: fd.id,
      model: 'FieldDefinition',
      name: fd.name,
      elementId: fd.element[0].id,
      type: fd.type,
      instances: fd.instances.map(fv => FieldValueEntity.toModel(fv)),
      defaultValue: fd.defaultValue,
    }
  }

  public static toTemplate(
    entity: FieldDefinitionEntity,
    _options?: any
  ): FieldDefinitionTemplate {
    return {
      id: `template(${entity.id})`,
      name: entity.name,
      type: entity.type,
      defaultValue: entity.defaultValue,
    }
  }

  public static async create(
    realm: Realm,
    ctx: Ctx,
    fieldDefinition: RequireAtLeast<Partial<FieldDefinition>, 'elementId'>
  ) {
    // Check here that the user has permission to create an element (in the current user context)
    console.log(`create: dont forget to build out the ctx business...${ctx}`) // this will do something some day...

    // get the element that we're creating the definition on
    const element = await realm.objectForPrimaryKey<ElementEntity>(
      'Element',
      fieldDefinition.elementId
    )
    // create a new definition and push it into the element
    const fdObj = new FieldDefinitionEntity({
      name: fieldDefinition.name,
      type: fieldDefinition.type,
      defaultValue: fieldDefinition.defaultValue,
    })

    if (element) {
      await realm.write(() => {
        const fd = realm.create('FieldDefinition', fdObj)
        element.fieldDefinitions.push(fd) // add the new definition to the element
      })
      // Create fieldValues for each ED on this element
      element.elementData.map(
        async ed =>
          await FieldValueEntity.create(
            realm,
            ctx,
            {},
            { elementDataId: ed.id, fieldDefinitionId: fdObj.id }
          )
      )
    }
    // TODO return something
  }

  public static async update(
    realm: Realm,
    ctx: Ctx,
    fieldDefinition: FieldDefinition
  ) {
    // TODO: Check here that the user has permission to update a FieldDefinition (in the current user context)
    console.log(`update: dont forget to build out the ctx business...${ctx}`) // this will do something some day...
    // Update the fieldDefinition...
    realm.write(() => {
      realm.create('FieldDefinition', fieldDefinition, true)
    })
  }

  public static async delete(realm: Realm, ctx: Ctx, id: string) {
    // Check here that the user has permission to delete a field definition (in the current user context)
    console.log(
      `delete field definition: dont forget to build out the ctx business...${ctx}`
    ) // this will do something some day...

    // Get the fieldDefinition we're going to delete...
    const fd = await realm.objectForPrimaryKey<FieldDefinitionEntity>(
      'FieldDefinition',
      id
    )
    if (fd) {
      const fields = fd.instances
      realm.write(async () => {
        await realm.delete(fields) // delete any instances of this field definition
        realm.delete(fd) // delete the field definition
      })
    }
  }

  public static createFromTemplate(
    realm: Realm,
    fieldDefinitions: FieldDefinitionTemplate[]
  ) {
    return fieldDefinitions.map(f =>
      realm.create<FieldDefinitionEntity>('FieldDefinition', f)
    )
  }
}
