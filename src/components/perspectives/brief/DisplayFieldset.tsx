import * as React from 'react'
import { Element, TreeDefinition } from '@models'
import { Box, useDeepLink } from '@components/shared'
import { FieldsetTable } from './fieldsetTable'

export interface DisplayFieldset {
  element: Element
  td: TreeDefinition | undefined
}

export const DisplayFieldset = ({ element }: DisplayFieldset) => {
  const { customLinked, linkToIds } = useDeepLink()

  // Clear link id from queue
  const handleOnLink = (id: string) => customLinked(id)

  return (
    <Box bg='#282E3A' radius='4px' border='1px solid #38414C' width='100%'>
      <Box width='100%' height='300px'>
        <FieldsetTable
          element={element}
          scrollToIds={linkToIds}
          onScrollTo={handleOnLink}
        />
      </Box>
    </Box>
  )
}
