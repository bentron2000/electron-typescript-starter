import { ipcRenderer } from 'electron'
import { v4 as uuid } from 'uuid'
import { all, any, union } from 'ramda'

import { TreeDefinition, tDfindById } from './TreeDefinition'
import {
  TreeInstance,
  tIfindById,
  tIflatMap,
  tIgetBranchByTargetId,
} from './TreeInstance'
import { ElementData } from '@models/ElementData'
import { FieldDefinition } from '@models/FieldDefinition'
import { Ctx } from '@models/Ctx'
import { ElementRelevance } from '@models/ElementRelevance'

import { LoupeRealmIPCSendResponse } from '@models/ipc'

import { ipcToDb } from '@redux/state/helpers/ipcDbWindowHelper'

export interface Element {
  readonly id: string
  readonly model: string
  name: string
  sectionId: string
  isFieldSet: boolean
  treeDefinitionRelevanceId?: string
  nestedTreeDefinitionRelevanceId?: string
  treeInstanceRelevanceIds: string[]
  data: ElementData[]
  fieldDefinitions: FieldDefinition[]
}

export function buildElement(e: Partial<Element>): Element {
  return {
    id: '',
    model: 'Element',
    name: '',
    sectionId: '',
    isFieldSet: false,
    treeInstanceRelevanceIds: [],
    data: [],
    fieldDefinitions: [],
    ...e,
  }
}

export function updateElementRelevance(
  ctx: Ctx,
  payload: ElementRelevance,
  callback: LoupeRealmIPCSendResponse
) {
  const responseChannel = uuid()
  ipcToDb('update-element-relevance', ctx, payload, responseChannel)
  ipcRenderer.once(responseChannel, callback)
}

// Get element (static) relators filtered by selectedTi
// If a relator exists within the target parent branch, the element has an inherited
// relationship
export function relators(
  element: Element,
  rootTi: TreeInstance,
  selectedTi: TreeInstance
): TreeInstance[] {
  return tIgetBranchByTargetId(rootTi, selectedTi.parentId).filter(ti =>
    ti.elements.includes(element.id)
  )
}

// Get element (fieldset) nested relators filterable by selectedTi.
export function nestedRelators(
  element: Element,
  rootTd: TreeDefinition,
  selectedTi?: TreeInstance
): TreeInstance[] {
  const rootTi = rootTd.instances[0]
  const tdRel = tDfindById(rootTd, element.treeDefinitionRelevanceId)[0]
  const relevance =
    tdRel &&
    // Optionally filter by a given TI ("all products in ...", ensure selectedTi is a "product")
    (selectedTi ? tdRel.id === selectedTi.definitionId : true) &&
    // Nested relevance set to entire project; include all selectedTd instances.
    (element.treeInstanceRelevanceIds.includes(rootTi.id)
      ? tdRel.instances
      : // Filter instances by ti relevances. Note, tiRelevanceIds can be more than 1 level up
        // the tree branch (i.e all views in 1 department).
        tdRel.instances.filter(ti => {
          const tiRels = tIfindById(rootTi, element.treeInstanceRelevanceIds)
          // If `ti` can be found in any `tiRels` branches.
          return any(
            tiRel =>
              !!tIflatMap(tiRel, inst => inst).find(node => node.id === ti.id),
            tiRels
          )
        }))
  return relevance ? relevance : []
}

// Determines DIRECT TI relationships
export function hasTiRelevance(
  element: Element,
  treeInstanceIds: string | string[],
  fn: (fn: (a: any) => boolean, list: readonly any[]) => boolean = all
): boolean {
  const ids = [treeInstanceIds].flat()
  return fn((id: string) => element.treeInstanceRelevanceIds.includes(id), ids)
}

// Generate new list of relevance ids (determining whether to add or remove given ti from list)
export function createTiRelevance(
  element: Element,
  treeInstanceIds: string | string[],
  add?: boolean,
  determineRelevanceFn?: (
    fn: (a: any) => boolean,
    list: readonly any[]
  ) => boolean
): string[] {
  const ids = [treeInstanceIds].flat()
  add = add != null ? add : !hasTiRelevance(element, ids, determineRelevanceFn)
  return add
    ? union(element.treeInstanceRelevanceIds, ids)
    : element.treeInstanceRelevanceIds.filter(tiId => !ids.includes(tiId))
}

// Get ED for selectedTi. Note, a fieldset element has one ED per TI it is related to.
export function relatedElementData(
  element: Element,
  selectedTi: TreeInstance
): ElementData | undefined {
  return selectedTi
    ? element.data.find(ed => ed.treeInstanceIds.includes(selectedTi.id))
    : undefined
}
