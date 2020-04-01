import * as React from 'react'
import { useStoreActions } from '@redux/store'
import { LoupeRealmErrorResponse } from '@models/ipc'
import { Box, Flex, InlineEdit, Text, theme, useToasts } from '@components/shared'
import { IHeaderCell } from './HeaderRenderer'

// Renders a FieldDefinition header cell
export const HeaderDefinitionCell = ({ column }: IHeaderCell) => {
  const { addToast } = useToasts()
  const updateFieldDef = useStoreActions(a => a.briefPerspective.field.updateDefinition)

  const handleSave = (value: string) => {
    updateFieldDef({ id: column.fd.id, name: value })
      .catch((err: LoupeRealmErrorResponse) =>
        addToast(err.message, { type: 'negative' })
      )
  }

  return (
    <Box p='8px 1px 8px 16px' height='100%' width='100%'>
      <Flex align='center' justify='center' height='100%'>
        <InlineEdit width='100%' p='5px 0 5px 8px' saveContent={handleSave}>
          <Text color={theme.grayLighter} mb='0' body>
            {column.fd.name}
          </Text>
        </InlineEdit>
      </Flex>
    </Box>
  )
}
