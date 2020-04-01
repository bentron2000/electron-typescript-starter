import * as React from 'react'
import { Checkbox } from './Checkbox'
import { Flex, Box } from '..'
import { theme } from '../Theme/theme'

interface BoxCheckbox extends Checkbox, Pick<Box, 'm' | 'p' | 'bg'> {}

export const BoxCheckbox = ({
  m = '4px 0',
  p = '6px',
  bg = theme.grayDark,
  ...cbProps
}: BoxCheckbox) => {
  return (
    <Flex direction='column'>
      <Box
        m={cbProps.locked ? '3px -1px' : m}
        p={p}
        radius='4px'
        bg={cbProps.locked || cbProps.someChecked ? 'transparent' : bg}
        border={
          cbProps.locked || cbProps.someChecked
            ? `1px solid ${theme.grayDark}`
            : ''
        }
      >
        <Checkbox {...cbProps} />
      </Box>
    </Flex>
  )
}
