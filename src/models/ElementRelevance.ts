import { Element } from '@models/Element'

export interface ElementRelevance {
  element: Element
  treeDefinitionRelevanceId?: string | undefined
  nestedTreeDefinitionRelevanceId?: string | undefined
  treeInstanceRelevanceIds: string[]
}
