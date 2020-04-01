import * as React from 'react'
import pluralize from 'pluralize'

import { TreeDefinition, Element } from '@models'

import { Text } from '..'
import { theme } from '../Theme/theme'
import { tDfindById } from '@models/TreeDefinition'
import { tIfindById } from '@models/TreeInstance'

/**
 * --------------------------------------------------
 * Relevance Text Generator
 * Generate a message describing the relevance options
 * --------------------------------------------------
 */

const determineRelevance = (element: Element, rootTd: TreeDefinition) => {
  const rootTi = rootTd ? rootTd.instances[0] : undefined

  const td = element.treeDefinitionRelevanceId
    ? tDfindById(rootTd, element.treeDefinitionRelevanceId)[0]
    : null

  const tis = rootTi ? tIfindById(rootTi, element.treeInstanceRelevanceIds) : []
  const nestedTd = element.isFieldSet
    ? tDfindById(rootTd, element.nestedTreeDefinitionRelevanceId)[0]
    : tDfindById(
        rootTd,
        tis.map(ti => ti.definitionId)
      )[0]

  if (!nestedTd) {
    console.log(rootTi, td, nestedTd)
    // TODO: Ben FIXMEPLS
    return 'OOOOPS'
  }

  const tisIsRoot = nestedTd.id === rootTd.id
  const tisCount =
    nestedTd.instances.length === tis.length ? 'All' : String(tis.length)

  const tdLabel = td
    ? `All ${pluralize(td.name)}` + (tisIsRoot ? '' : ' in ')
    : ''
  const tiLabel = !tisIsRoot
    ? `${tisCount} ${pluralize(nestedTd.name, Number(tisCount))}`
    : ''

  return `${tdLabel}${tiLabel}`
}

export interface IRelevanceMessage {
  element: Element
  rootTd: TreeDefinition
  resultCb: (val: string) => void
}
export const RelevanceMessage = ({
  element,
  rootTd,
  resultCb,
}: IRelevanceMessage) => {
  const [message, setMessage] = React.useState<string>('')

  React.useEffect(() => {
    const msg = determineRelevance(element, rootTd)
    resultCb(msg)
    setMessage(msg)
  }, [
    rootTd,
    element.treeDefinitionRelevanceId,
    element.treeInstanceRelevanceIds,
  ])

  return (
    <Text subtitle mb='0' color={theme.grayLighter}>
      {message}
    </Text>
  )
}
