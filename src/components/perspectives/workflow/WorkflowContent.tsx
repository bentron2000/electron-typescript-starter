import * as React from 'react'
import { Box, theme } from '@components/shared'
import Diagram from './Diagram'

export interface WorkflowContent { }

export const WorkflowContent = () => {
  return (
    <Box bg={theme.grayDarker} width={'100%'}>
      <Diagram />
    </Box>
  )
}
