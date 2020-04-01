import * as React from 'react'
import { useStoreState, useStoreActions } from '@redux/store'
import { Box, Button, Flex } from '../../../shared'
import { theme } from '../../../shared/Theme/theme'
import styled from 'styled-components'

const Pointer = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  bottom: -9px;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid ${theme.primary};
  left: calc(50% - 10px);
`
export interface WorkflowActionPanelContent {}

export const WorkflowActionPanelContent = () => {
  const isAdminMode = useStoreState(store => store.app.isAdminMode)
  const toggleAdminMode = useStoreActions(
    actions => actions.app.toggleAdminMode
  )
  return (
    <>
      <Box p={theme.s2} bg={theme.grayDark} bt={theme.darkStroke}>
        <Flex align='center' justify='flex-end' direction='row'>
          <Box width='auto'>
            <Button
              secondary
              color={isAdminMode ? theme.primary : theme.grayLight}
              iconLeft={isAdminMode ? 'tick' : 'edit'}
              onClick={() => toggleAdminMode(!isAdminMode)}>
              {isAdminMode ? 'Viewing as Admin' : 'Viewing as Collaborator'}
            </Button>
            {isAdminMode && <Pointer />}
          </Box>
        </Flex>
      </Box>
    </>
  )
}
