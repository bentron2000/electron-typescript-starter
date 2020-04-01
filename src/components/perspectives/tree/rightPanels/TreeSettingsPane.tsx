import * as React from 'react'
import styled from 'styled-components'

import { TreeDefinition } from '@models'
import { LoupeRealmResponse, LoupeRealmErrorResponse } from '@models/ipc'

import { BoxCheckbox, Flex, Box } from '../../../shared'
import { useToasts } from '../../../shared/toast/ToastProvider'
import pluralize from 'pluralize'

const DividerLine = styled(Box)`
  opacity: 0.19;
`

interface TreeSettingsPane {
  currentTD: TreeDefinition
  updateTD: (treeDefinition: TreeDefinition) => Promise<LoupeRealmResponse>
}

export const TreeSettingsPane = ({ currentTD, updateTD }: TreeSettingsPane) => {
  const { addToast } = useToasts()

  const handleUpdateTdError = (err: LoupeRealmErrorResponse) => {
    addToast(err.message, { type: 'negative' })
  }

  const handleCollaboratorModeChange = () => {
    currentTD.collaboratorMode = !currentTD.collaboratorMode
    updateTD(currentTD).catch(handleUpdateTdError)
  }
  const handleMediaAllowedChange = () => {
    currentTD.mediaAllowed = !currentTD.mediaAllowed
    updateTD(currentTD).catch(handleUpdateTdError)
  }

  return (
    <Box p='0 16px' display='block'>
      <Flex direction='column'>
        <BoxCheckbox
          m='0'
          p='16px 0'
          bg='transparent'
          checked={currentTD.collaboratorMode}
          onChange={handleCollaboratorModeChange}
        >
          Allow users to create new '{pluralize(currentTD.name)}'.
        </BoxCheckbox>
        <DividerLine m='0 10px' bb='1px solid #A5A6B3' />
        <BoxCheckbox
          m='0'
          p='16px 0'
          bg='transparent'
          checked={currentTD.mediaAllowed}
          onChange={handleMediaAllowedChange}
        >
          Allow users to upload assets to '{pluralize(currentTD.name)}'.
        </BoxCheckbox>
      </Flex>
    </Box>
  )
}
