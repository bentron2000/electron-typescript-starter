import * as React from 'react'
import { useStoreActions } from '@redux/store'
import { LoupeRealmErrorResponse } from '@models/ipc'
import { FieldValue } from '@models/FieldValue'
import { Box, Flex, Text, Input, theme, useToasts } from '@components/shared'
import { ICell } from './RowRenderer'

interface IRowFieldCell extends ICell {
  cellData: FieldValue
}
// Renders a field value row cell
export const RowFieldCell = ({ cellData: fieldValue, columnIndex }: IRowFieldCell) => {
  const { addToast } = useToasts()
  const updateFieldValue = useStoreActions(a => a.briefPerspective.field.updateValue)

  const handleOnChange = (value: string) => {
    updateFieldValue({ id: fieldValue.id, value })
      .catch((err: LoupeRealmErrorResponse) =>
        addToast(err.message, { type: 'negative' })
      )
  }

  return (
    <Box p={columnIndex === 0 ? '0' : '8px 16px'} height='100%'>
      <Flex align='center' justify=' center' height='100%'>
        {columnIndex > 0
          ? <Input
            width='100%'
            value={fieldValue.value}
            onBlur={handleOnChange}
          />
          : <Text color={theme.grayLighter} mb='0' body>{fieldValue.value}</Text>
        }
      </Flex>
    </Box>
  )
}
