import * as pluralize from 'pluralize'
import { sum } from 'ramda'
import { TreeDefinition, ElementRelevance } from '@models'
import { tDfindById } from '@models/TreeDefinition'
import { tIfindById } from '@models/TreeInstance'

/**
 * --------------------------------------------------
 * A relationship between a static element and the tree
 * --------------------------------------------------
 */
export interface ElementRelationShipDescription {
  fullDescription: string
  tdDescription: string | undefined
  tiDescription: string
  examples: string
  tiCount: number
}

export const describeElement = (
  relevance: ElementRelevance,
  rootTd: TreeDefinition
): ElementRelationShipDescription => {
  // '2 Categories, 3 Products'
  // 'Accessories, Handbags, Black Clutch, Woven Clutch, Red Tassel'

  const results = {}
  const rootTIDescriptor = 'Entire Project' // Use this if the relationship is a rootTI...

  relevance.treeInstanceRelevanceIds.forEach(tiId => {
    const ti = tIfindById(rootTd.instances[0], tiId)[0] // fetch the TI
    const td = tDfindById(rootTd, ti.definitionId)[0] // fetch its TD

    // init the results for this definition if no results exist yet
    if (!results[td.id]) {
      results[td.id] = {}
      results[td.id].count = 0
      results[td.id].examples = new Set()
    }

    results[td.id].examples.add(ti.name) // add this TI as an example...
    results[td.id].count++ // increment counter

    results[td.id].name = !ti.parentId
      ? rootTIDescriptor
      : results[td.id].count > 1
      ? pluralize.plural(td.name)
      : td.name
  })

  const payload = {
    tdDescription: undefined as string | undefined,
    tiDescription: Object.keys(results)
      .map(k =>
        results[k].name === rootTIDescriptor
          ? rootTIDescriptor
          : results[k].count === 1
          ? [...results[k].examples.values()][0]
          : `${results[k].count} ${results[k].name}`
      )
      .join(', '),
    examples: Object.keys(results)
      .map(k =>
        results[k].name === rootTIDescriptor
          ? []
          : [...results[k].examples.values()]
      )
      .flat()
      .join(', '),
    tiCount: sum(Object.keys(results).map(k => results[k].count)),
  }

  // if this is a fieldset we need to get 'All <pluralized TD relevance name>`
  if (relevance.element.isFieldSet && relevance.treeDefinitionRelevanceId) {
    const relatedTD = tDfindById(rootTd, relevance.treeDefinitionRelevanceId)[0]
    payload.tdDescription = 'All ' + pluralize.plural(relatedTD.name)
  }

  const fullDescription = payload.tdDescription
    ? payload.tiDescription.length > 0
      ? payload.tdDescription + ' in ' + payload.tiDescription
      : payload.tdDescription
    : payload.tiDescription

  const output = { fullDescription, ...payload }

  return output
}
