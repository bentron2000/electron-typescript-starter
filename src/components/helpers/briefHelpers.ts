import { intersection } from 'ramda'
import { BriefFilter } from '@redux/state'
import { TreeDefinition } from '@models/TreeDefinition'
import { TreeInstance } from '@models/TreeInstance'
import { Element } from '@models/Element'
import { Section } from '@models/Section'
import { tIreduce } from '@models/TreeInstance'
import { buildSection } from '@models/Section'

export const briefFilter = (
  tree: TreeDefinition,
  filter: BriefFilter,
  brief: Section[]
) => {
  // Filter brief by stage - if no stages selected return all...
  const filterByStage = (sections: Section[]): Section[] => {
    return filter.stageFilter.length > 0
      ? sections.filter(
          section =>
            intersection(section.stageIds, filter.stageFilter).length > 0
        )
      : sections
  }

  // Filter brief by section - if no sections selected return all...
  const filterBySection = (sections: Section[]): Section[] => {
    return filter.sectionFilter.length > 0
      ? sections.filter(
          section => intersection([section.id], filter.sectionFilter).length > 0
        )
      : sections
  }

  // Filter brief by tree relevance - if no TreeInstances are selected, return all...
  const filterByTree = (sections: Section[]): Section[] => {
    const tdTiLists = filter.treeFilter.flatMap(id => {
      const getTdTIList = (acc: string[][], node: TreeInstance): string[][] => {
        const newAcc = [
          [...acc[0], node.id],
          [...acc[1], node.definitionId],
        ]
        return node.id === id // isTarget
          ? newAcc
          : node.children.length > 0 // hasChildren
          ? newAcc
          : acc[0].includes(id) // acc already includesTarget
          ? acc
          : [[] as string[], [] as string[]]
      }
      return tIreduce(tree.instances[0], getTdTIList, [[], []])
    })

    const relevantTINodes = [
      ...new Set(
        tdTiLists.reduce<string[]>((acc, val) => [...acc, ...val[0]], [])
      ),
    ]

    const relevantTDNodes = [
      ...new Set(
        tdTiLists.reduce<string[]>((acc, val) => [...acc, ...val[1]], [])
      ),
    ]

    // map over the sections.
    // for each of the sections, look at the elements
    // if the element's relevance TD or TI[] matches the filter, keep it.
    // if a section has no elements, remove it.
    const filterElement = (element: Element) => {
      return (
        (element.treeDefinitionRelevanceId
          ? relevantTDNodes.includes(element.treeDefinitionRelevanceId)
          : false) ||
        intersection(relevantTINodes, element.treeInstanceRelevanceIds).length >
          0
      )
    }

    const filterSection = (section: Section) => section.elements.length > 0

    const result = sections.map(section => {
      const filteredElements = section.elements.filter(filterElement)
      return buildSection({ ...section, elements: filteredElements })
    })

    return filter.treeFilter.length > 0
      ? result.filter(filterSection)
      : sections
  }

  return filterByTree(filterBySection(filterByStage(brief)))
}
