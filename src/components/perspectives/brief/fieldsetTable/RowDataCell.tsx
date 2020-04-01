import * as React from 'react'
import { useStoreActions } from '@redux/store'
import { ElementData } from '@models'
import { LoupeRealmErrorResponse } from '@models/ipc'
import { Box, Flex, InlineEdit, Text, theme, useToasts } from '@components/shared'
import { ICell } from './RowRenderer'

interface IRowDataCell extends ICell {
  cellData: ElementData
}

// Renders an ElementData row cell
export const RowDataCell = ({ cellData: elementData }: IRowDataCell) => {
  const { addToast } = useToasts()
  const updateTreeInstance = useStoreActions(a => a.project.tree.updateTreeInstance)

  const handleSave = (value: string) => {
    updateTreeInstance({ id: elementData.treeInstanceIds[0], name: value })
      .catch((err: LoupeRealmErrorResponse) =>
        addToast(err.message, { type: 'negative' })
      )
  }

  return (
    <Box p='8px 1px 8px 0px' height='100%' width='100%' br={theme.lightStroke}>
      <Flex align='center' justify='center' height='100%'>
        <InlineEdit width='100%' p='5px 0 5px 8px' saveContent={handleSave}>
          <Text color={theme.grayLighter} mb='0' body>
            {elementData.name}
          </Text>
        </InlineEdit>
      </Flex>
    </Box>
  )
}
