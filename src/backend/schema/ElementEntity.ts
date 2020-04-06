import { v4 as uuid } from 'uuid'
import { ipcRenderer, IpcRendererEvent } from 'electron'
import { intersection, path } from 'ramda'
import { TreeDefinitionEntity } from '@backend/schema/TreeDefinitionEntity'
import { TreeInstanceEntity } from '@backend/schema/TreeInstanceEntity'
import { SectionEntity } from '@backend/schema/SectionEntity'
import { FieldDefinitionEntity } from '@backend/schema/FieldDefinitionEntity'
import { ElementDataEntity } from '@backend/schema/ElementDataEntity'
import { ProjectEntity } from '@backend/schema/ProjectEntity'
import { FieldValueEntity } from '@backend/schema/FieldValueEntity'
import { INewTemplateEntities } from '@backend/schema/TemplateEntity'

import { Ctx } from '@models/Ctx'
import { Element } from '@models/Element'
import { ElementData } from '@models/ElementData'
import { ElementRelevance } from '@models/ElementRelevance'
import { buildElementData } from '@models/ElementData'
import { tIflatMap } from '@models/TreeInstance'
import { LoupeRealmResponse, ipcReply } from '@models/ipc'
import {
  LoupeRealmResponseCallback,
  renderSuccess,
  renderError,
} from '@models/ipc'

export interface ElementTemplate {
  id: string
  name: string
  isFieldSet: boolean
  treeDefinitionRelevanceId?: string
  nestedTreeDefinitionRelevanceId?: string
  elementDataIds: string[]
  fieldDefinitionIds: string[]
}

export class ElementEntity {
  public static schema: Realm.ObjectSchema = {
    primaryKey: 'id',
    name: 'Element',
    properties: {
      id: 'string',
      name: 'string',
      isFieldSet: { type: 'bool', default: false }, // true: element is FieldSet, false: element is 'static' (or just 'element')
      treeDefinitionRelevance: 'TreeDefinition?',
      // Fieldset element nested relevance td selection
      nestedTreeDefinitionRelevance: 'TreeDefinition?',
      treeInstanceRelevance: 'TreeInstance[]',
      section: {
        type: 'linkingObjects',
        objectType: 'Section',
        property: 'elements',
      },
      elementData: 'ElementData[]',
      fieldDefinitions: 'FieldDefinition[]',
    },
  }
  public id: string
  public name: string
  public isFieldSet: boolean = false
  public treeDefinitionRelevance?: TreeDefinitionEntity
  public nestedTreeDefinitionRelevance?: TreeDefinitionEntity
  public treeInstanceRelevance: TreeInstanceEntity[]
  public section: SectionEntity[]
  public elementData: ElementDataEntity[]
  public fieldDefinitions: FieldDefinitionEntity[]

  constructor(object: Partial<ElementEntity> = {}) {
    Object.assign(this, object)
    this.id = object.id || uuid()
    this.name = object.name || 'New Element'
    this.isFieldSet = object.isFieldSet != null ? object.isFieldSet : false
  }

  public static toModel(e: ElementEntity): Element {
    return {
      id: e.id,
      model: 'Element',
      name: e.name,
      sectionId: e.section[0].id,
      isFieldSet: e.isFieldSet,
      treeDefinitionRelevanceId: path(['id'], e.treeDefinitionRelevance),
      nestedTreeDefinitionRelevanceId: path(
        ['id'],
        e.nestedTreeDefinitionRelevance
      ),
      treeInstanceRelevanceIds: e.treeInstanceRelevance.map(ti => ti.id),
      data: e.elementData.map(ed => ElementDataEntity.toModel(ed)),
      fieldDefinitions: e.fieldDefinitions.map(fd =>
        FieldDefinitionEntity.toModel(fd)
      ),
    }
  }

  public static toTemplate(
    entity: ElementEntity,
    _options?: any
  ): ElementTemplate {
    return {
      id: `template(${entity.id})`,
      name: entity.name,
      isFieldSet: entity.isFieldSet,
      treeDefinitionRelevanceId: entity.treeDefinitionRelevance
        ? `template(${entity.treeDefinitionRelevance.id})`
        : undefined,
      nestedTreeDefinitionRelevanceId: entity.nestedTreeDefinitionRelevance
        ? `template(${entity.nestedTreeDefinitionRelevance.id})`
        : undefined,
      elementDataIds: entity.elementData.map(ed => `template(${ed.id})`),
      fieldDefinitionIds: entity.fieldDefinitions.map(
        fd => `template(${fd.id})`
      ),
    }
  }

  public static async create(
    realm: Realm,
    ctx: Ctx,
    payload: Element,
    responseCallback: LoupeRealmResponseCallback,
    args: { positionIndex?: number } = {}
  ) {
    try {
      await realm.write(() => {
        const elEntity = this._create(realm, ctx, payload, args)
        responseCallback(renderSuccess(ElementEntity.toModel(elEntity)))
      })
    } catch (e) {
      responseCallback(renderError(e, 'Error on create element', payload))
    }
  }

  public static syncCreate(
    realm: Realm,
    ctx: Ctx,
    payload: Element,
    args: { positionIndex?: number } = {}
  ) {
    return this._create(realm, ctx, payload, args)
  }

  public static async update(
    realm: Realm,
    ctx: Ctx,
    payload: Element,
    responseCallback: LoupeRealmResponseCallback
  ) {
    // TODO: Check here that the user has permission to update an element (in the current user context)
    console.log(`update: dont forget to build out the ctx business...${ctx}`) // this will do something some day...
    try {
      await realm.write(() => {
        realm.create('Element', payload, true)
        responseCallback(renderSuccess(payload))
      })
    } catch (e) {
      responseCallback(renderError(e, 'Error on update element', payload))
    }
  }

  public static async updateElementRelevance(
    realm: Realm,
    ctx: Ctx,
    elementRelevance: ElementRelevance,
    responseCallback: LoupeRealmResponseCallback
  ) {
    // TODO: Check here that the user has permission to update an element (in the current user context)
    console.log(`dont forget to build out the ctx business...${ctx}`) // this will do something some day...
    try {
      await realm.write(() => {
        // Get the Element
        const element = realm.objectForPrimaryKey<ElementEntity>(
          'Element',
          elementRelevance.element.id
        )

        if (!element) {
          throw new Error(
            'Error on update element relevance: element not found'
          )
        }

        // Save new TD relevance or use existing
        const td = elementRelevance.treeDefinitionRelevanceId
          ? realm.objectForPrimaryKey<TreeDefinitionEntity>(
              'TreeDefinition',
              elementRelevance.treeDefinitionRelevanceId
            )
          : element.treeDefinitionRelevance

        // Fieldset nested tree definition selection
        const nestedTd = elementRelevance.nestedTreeDefinitionRelevanceId
          ? realm.objectForPrimaryKey<TreeDefinitionEntity>(
              'TreeDefinition',
              elementRelevance.nestedTreeDefinitionRelevanceId
            )
          : element.nestedTreeDefinitionRelevance

        // Get the relevant TIs
        const idQuery = elementRelevance.treeInstanceRelevanceIds
          .map(id => `id == '${id}'`)
          .join(' OR ')

        const tis = idQuery
          ? realm
              .objects<TreeInstanceEntity>('TreeInstance')
              .filtered(idQuery)
              .map(ti => ti)
          : []

        // If this is a fieldset, populate with TR/ED/FV
        // See notes in populateFieldsetData()
        if (element.isFieldSet) {
          if (td) {
            this.populateFieldsetData(realm, ctx, element, td, [...tis])
          }
        } else {
          this.populateStaticData(realm, ctx, element, [...tis])
        }

        // Update the elementRelevance...
        const updatedElement = realm.create<ElementEntity>(
          'Element',
          {
            id: element.id,
            treeDefinitionRelevance: td,
            nestedTreeDefinitionRelevance: nestedTd,
            treeInstanceRelevance: [...tis],
          },
          true
        )

        responseCallback(renderSuccess(ElementEntity.toModel(updatedElement)))
      })
    } catch (e) {
      responseCallback(
        renderError(e, 'Error on update element relevance', elementRelevance)
      )
    }
  }

  public static async delete(
    realm: Realm,
    ctx: Ctx,
    ids: string[],
    responseCallback: LoupeRealmResponseCallback
  ) {
    console.log(
      `delete element: dont forget to build out the ctx business...${ctx}`
    )

    try {
      await realm.write(() => {
        this._delete(realm, ctx, ids)
        responseCallback(renderSuccess({ ids }))
      })
    } catch (e) {
      responseCallback(renderError(e, 'Error on delete element', { ids }))
    }
  }

  public static syncDelete(realm: Realm, ctx: Ctx, ids: string[]) {
    return this._delete(realm, ctx, ids)
  }

  public static registerListeners(realm: Realm) {
    ipcRenderer.on(
      'update-element-relevance',
      (
        event: IpcRendererEvent,
        ctx: Ctx,
        payload: ElementRelevance,
        resChannel: string
      ) => {
        const sendResponse = (response: LoupeRealmResponse) => {
          ipcReply(event, resChannel, response)
        }
        this.updateElementRelevance(realm, ctx, payload, sendResponse)
      }
    )
  }

  public static createFromTemplate(
    realm: Realm,
    elements: ElementTemplate[],
    newEntities: INewTemplateEntities
  ) {
    return elements.map(e =>
      realm.create<ElementEntity>('Element', {
        ...e,
        fieldDefinitions: newEntities.fieldDefinitions.filter(fd =>
          e.fieldDefinitionIds.includes(fd.id)
        ),
      })
    )
  }

  private static _create(
    realm: Realm,
    ctx: Ctx,
    payload: Element,
    args: { positionIndex?: number } = {}
  ) {
    console.log(`create: dont forget to build out the ctx business...${ctx}`)

    const section = realm.objectForPrimaryKey<SectionEntity>(
      'Section',
      payload.sectionId
    )

    if (!section) {
      throw new Error(`Invalid section id=${payload.sectionId}`)
    }

    const project = realm
      .objects<ProjectEntity>('Project')
      .filtered(
        `stages.sectionPermissions.section.id == '${payload.sectionId}'`
      )

    const rootTi = project[0].treeDefinitions[0].instances[0]

    // Validate TI ids are apart of project tree definitions
    const tis =
      payload.treeInstanceRelevanceIds.length > 0
        ? project[0].treeDefinitions
            .map(td =>
              td.instances.filter(ti =>
                payload.treeInstanceRelevanceIds.includes(ti.id)
              )
            )
            .flat()
        : undefined

    // Build appropriate relationships based on element type
    return payload.isFieldSet
      ? this.createFieldset(
          realm,
          ctx,
          section,
          payload,
          tis,
          args.positionIndex
        )
      : this.createStatic(
          realm,
          ctx,
          section,
          payload,
          tis || rootTi.children,
          args.positionIndex
        )
  }

  private static _delete(realm: Realm, ctx: Ctx, ids: string[]) {
    if (!ids.length) {
      return ids
    }

    const elements = realm
      .objects<ElementEntity>('Element')
      .filtered(ids.map(id => `id == '${id}'`).join(' OR '))

    elements.forEach(element => {
      // remove this element from the sort order on the section
      const elementsOrder = element.section[0].elementsOrder
      elementsOrder.splice(elementsOrder.indexOf(element.id), 1)

      ElementDataEntity.syncDelete(
        realm,
        ctx,
        element.elementData.map(ed => ed.id)
      )

      realm.delete(element.fieldDefinitions)
    })

    realm.delete(elements)

    return ids
  }

  private static createStatic(
    realm: Realm,
    ctx: Ctx,
    section: SectionEntity,
    element: Element,
    ti: TreeInstanceEntity[],
    position: number | undefined
  ) {
    const defaultElementDataValue = JSON.stringify({
      object: 'value',
      document: {
        object: 'document',
        data: {},
        nodes: [
          {
            object: 'block',
            type: 'paragraph',
            data: {},
            nodes: [
              { object: 'text', text: 'Default element data...', marks: [] },
            ],
          },
        ],
      },
    })

    const newElement = realm.create<ElementEntity>(
      'Element',
      new ElementEntity({
        name: element.name,
        isFieldSet: false,
        treeDefinitionRelevance: undefined,
        treeInstanceRelevance: ti || [],
      }),
      true
    )

    // Push the new element into the section
    section.elements.push(newElement)

    // create the ED or duplicate from existing
    const existingElementData = element.data[0]
      ? element.data[0]
      : ({} as ElementData)
    ElementDataEntity.syncCreate(
      realm,
      ctx,
      buildElementData({
        ...existingElementData,
        value: defaultElementDataValue,
        treeInstanceIds: ti.map(inst => inst.id),
        elementId: newElement.id,
      })
    )

    // Update the section's elementsOrder List
    // NB! This is a realm.list NOT an array. Insertions/Deletions via splice()
    // This caused a bug that took a day to fix 🤦‍
    const newPosition = this.elementPosition(section, element.id, position)
    section.elementsOrder.splice(newPosition, 0, newElement.id)

    return newElement
  }

  private static createFieldset(
    realm: Realm,
    ctx: Ctx,
    section: SectionEntity,
    element: Element,
    ti: TreeInstanceEntity[] | undefined,
    position: number | undefined
  ) {
    const project = realm
      .objects<ProjectEntity>('Project')
      .filtered(`stages.sectionPermissions.section.id == '${section.id}'`)[0]
    const treeDefinitions = project.treeDefinitions
    const rootTd = treeDefinitions[0]
    const td =
      // The given TD
      treeDefinitions.find(
        def => def.id === element.treeDefinitionRelevanceId
      ) ||
      // or, The bottom TD with media allowed
      treeDefinitions.filter(def => def.mediaAllowed).slice(-1)[0] ||
      // or, The first child of rootTD
      treeDefinitions.filter(def => def.parent.length === 0)[0].children[0]
    const nestedTd =
      treeDefinitions.find(
        def => def.id === element.nestedTreeDefinitionRelevanceId
      ) || rootTd

    // By default associated to rootTi
    const tiRelevance = ti || nestedTd.instances

    // create the new entries
    const newElement = realm.create(
      'Element',
      new ElementEntity({
        name: element.name,
        isFieldSet: true,
        treeDefinitionRelevance: td,
        nestedTreeDefinitionRelevance: nestedTd,
        treeInstanceRelevance: tiRelevance,
      }),
      true
    )

    // Push the new element into the section
    section.elements.push(newElement)
    // Update the section's elementsOrder List
    const newPosition = this.elementPosition(section, element.id, position)
    section.elementsOrder.splice(newPosition, 0, newElement.id)

    // populate the fieldset according to the relationship
    element.id
      ? this.duplicateFieldsetData(realm, ctx, newElement, element)
      : this.populateFieldsetData(realm, ctx, newElement, td, tiRelevance)

    return newElement
  }

  private static duplicateFieldsetData(
    realm: Realm,
    ctx: Ctx,
    newElement: ElementEntity,
    existingElement: Element
  ) {
    // Create a map of the newly created EDs FVs to be able to connect the new FD FVs to the ED ...
    const edFieldsMap: Array<{
      edId: string
      oldEdId: string
      fvs: string[]
    }> = []

    // Duplicate EDs and relate to new element
    existingElement.data.forEach(ed => {
      ed.elementId = newElement.id
      const newEd = ElementDataEntity.syncCreate(realm, ctx, ed)
      edFieldsMap.push({
        edId: newEd.id,
        oldEdId: ed.id,
        fvs: ed.fields.map(f => f.id),
      })
    })

    // TODO: implement a syncCreate method for FD & FV handling
    // creation of FDs & FVs
    existingElement.fieldDefinitions.forEach(fd => {
      // Duplicate FD
      const newFd = realm.create(
        'FieldDefinition',
        new FieldDefinitionEntity({
          id: uuid(),
          name: fd.name,
          type: fd.type,
          defaultValue: fd.defaultValue,
        })
      )
      // associate FD to element
      newElement.fieldDefinitions.push(newFd)
      // Duplicate existing FD instances (FVs)
      fd.instances.forEach(fv => {
        const newFV = realm.create(
          'FieldValue',
          new FieldValueEntity({ value: fv.value })
        )
        newFd.instances.push(newFV)

        // relate FV to corresponding duplicated ED
        const oldEdMap = edFieldsMap.find(
          mapObj =>
            mapObj.oldEdId === fv.elementDataId && mapObj.fvs.includes(fv.id)
        )
        if (oldEdMap) {
          const newEd = newElement.elementData.find(
            ed => ed.id === oldEdMap.edId
          )
          if (newEd) {
            newEd.fields.push(newFV)
          }
        }
      })
    })
  }

  // This code makes me want to cry..
  // TODO: refactor
  private static populateStaticData(
    realm: Realm,
    _ctx: Ctx,
    element: ElementEntity,
    tis: TreeInstanceEntity[]
  ) {
    const ed = element.elementData[0]
    if (ed) {
      // unrelate deselected tis from ed
      if (tis.length) {
        // All tis OTHER than the ones given
        const tisToRemoveEdRel = realm
          .objects<TreeInstanceEntity>('TreeInstance')
          .filtered(tis.map(ti => `id != '${ti.id}'`).join(' AND '))
        tisToRemoveEdRel.forEach(ti => {
          const edToRemoveIdx = ti.elementData.findIndex(
            tiEd => tiEd.id === ed.id
          )
          if (edToRemoveIdx >= 0) {
            ti.elementData.splice(edToRemoveIdx, 1)
          }
        })
      } else {
        // Remove from ALL tis
        const project = realm
          .objects<ProjectEntity>('Project')
          .filtered(
            `stages.sectionPermissions.section.id == '${element.section[0].id}'`
          )
        const rootTi = project[0].treeDefinitions[0].instances[0]
        const projectTiIds = tIflatMap(
          TreeInstanceEntity.toModel(rootTi),
          ti => ti.id
        )
        const tisToRemoveEdRel = realm
          .objects<TreeInstanceEntity>('TreeInstance')
          .filtered(projectTiIds.map(id => `id == '${id}'`).join(' OR '))
        tisToRemoveEdRel.forEach(ti => {
          const edToRemoveIdx = ti.elementData.findIndex(
            tiEd => tiEd.id === ed.id
          )
          if (edToRemoveIdx >= 0) {
            ti.elementData.splice(edToRemoveIdx, 1)
          }
        })
      }
      // add ed to tis unless already related
      tis.forEach(ti => {
        if (!ti.elementData.find(tiEd => tiEd.id === ed.id)) {
          ti.elementData.push(ed)
        }
      })
    }
  }

  private static populateFieldsetData(
    realm: Realm,
    ctx: Ctx,
    element: ElementEntity,
    td: TreeDefinitionEntity,
    tis: TreeInstanceEntity[]
  ) {
    // We will need to ensure that there is a TR and ED for each of the related instances.
    // If there is pre-existing data in EDs for this - we will need to decide to:
    //    DELETE - destroy any ED contents
    //    COPY - duplicate the contents into each new ED - this will have implications for potentially unique stuff
    //    MAP - some more complicated behaviour here if we wanted to map old values to new ones...

    // For now, we'll delete any existing ones and create new blank ones.
    console.log('TODO: maybe we need some options here... Delete/Copy/Map...')

    // Element TI relevance, filtered by element TD relevance.
    // E.g for "All products (td) in 2 categories (tis)" code below gets the 2 category instances
    // branch (flat mapped), and finds the instance related to the product td.
    const selectedTiIds = tis
      .map(tiRelEntity => {
        const tiRel = TreeInstanceEntity.toModel(tiRelEntity)
        const tree = tIflatMap(tiRel, ti => ti, true)
        return tree.filter(ti => ti.definitionId === td.id).map(ti => ti.id)
      })
      .flat()

    // Delete element EDs not related to any selectedTiIds
    element.elementData
      .filter(
        ed =>
          !intersection(
            ed.treeInstances.map(ti => ti.id),
            selectedTiIds
          ).length
      )
      .forEach(ed => {
        realm.delete(ed.fields)
        realm.delete(ed)
      })

    // Create ED and FVs for selected TIs unless and ED already exists.
    // This prevents overwriting of EDs when adding / removing fieldset TI relevance.
    // When the TD relevance is changed, ED is lost - deleted and recreated as blanks.
    td.instances
      .filter(
        ti =>
          selectedTiIds.includes(ti.id) &&
          !ti.elementData.find(ed => ed.element[0].id === element.id)
      )
      .forEach(ti => {
        const newEd = buildElementData({
          name: ti.name,
          treeInstanceIds: [ti.id],
          elementId: element.id,
        })
        const ed = ElementDataEntity.syncCreate(realm, ctx, newEd)
        element.fieldDefinitions.forEach(fd => {
          // TODO: implement a error handling & syncCreate method for FV creation of object & it's rels
          FieldValueEntity.create(
            realm,
            ctx,
            {},
            { elementDataId: ed.id, fieldDefinitionId: fd.id }
          )
        })
      })
  }

  private static elementPosition(
    section: SectionEntity,
    elementId: string,
    position: number | undefined
  ) {
    const existingPosition = section.elementsOrder.findIndex(
      id => id === elementId
    )
    return position != null
      ? // at the given position
        position
      : // position below the position of the section being duplicated
      existingPosition >= 0
      ? existingPosition + 1
      : // position at the end of the list
        section.elementsOrder.length
  }
}
