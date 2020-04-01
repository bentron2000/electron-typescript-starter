import { Element } from '@models'

export interface ElementRelevance {
  element: Element
  treeDefinitionRelevanceId?: string | undefined
  nestedTreeDefinitionRelevanceId?: string | undefined
  treeInstanceRelevanceIds: string[]
}
