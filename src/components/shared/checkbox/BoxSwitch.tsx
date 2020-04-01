import * as React from 'react'
import { Checkbox, Switch } from './'
import { Flex, Box } from '..'
import { theme } from '../Theme/theme'

interface BoxSwitch extends Checkbox, Pick<Box, 'm' | 'p' | 'bg'> {}

export const BoxSwitch = ({
  m = '4px 0',
  p = '6px',
  bg = theme.grayDark,
  ...cbProps
}: BoxSwitch) => {
  return (
    <Flex direction='column'>
      <Box
        m={cbProps.locked || !cbProps.checked ? '3px -1px' : m}
        p={p}
        radius='4px'
        bg={cbProps.locked || !cbProps.checked ? 'transparent' : bg}
        border={
          cbProps.locked || !cbProps.checked
            ? `1px solid ${theme.grayDark}`
            : ''
        }
      >
        <Switch {...cbProps} />
      </Box>
    </Flex>
  )
}
