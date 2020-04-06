import * as React from 'react'

import {
  Button,
  Box,
  Flex,
  StageSelector,
  AssetsZoomBar,
  useToasts,
  theme,
  Heading,
} from '@components/shared'
import { validIToastOptsTypes } from '@components/shared/toast/ToastProvider'
import { ConfigureRepoModal } from '@components/shared/createRepositoryModal/ConfigureRepoModal'

import { Stage } from '@models/Stage'
import { importFiles } from '@models/PendingAsset'
import { useStoreState, useStoreActions } from '@redux/store'

export const AssetsProjectPanelContent = () => {
  const { addToast } = useToasts()
  // Right panel visibility
  const isRightPanelOpen = useStoreState(s => s.app.isRightPanelOpen)
  const toggleRightPanel = useStoreActions(a => a.app.toggleRightPanel)

  // Stages
  const stages = useStoreState(s => s.project.stages.all)
  const currentStage = useStoreState(s => s.assetPerspective.stage.current)
  const setSelectedStage = useStoreActions(a => a.assetPerspective.stage.set)

  // Zoom Slider
  const assetsZoom = useStoreState(s => s.assetPerspective.interface.assetsZoom)
  const setAssetsZoom = useStoreActions(
    a => a.assetPerspective.interface.setAssetsZoom
  )

  // Project
  const currentProjectFromState = useStoreState(s => s.project.current)

  // Repo Modal
  const [modalIsOpen, setModalIsOpen] = React.useState<boolean>()

  // If there is no current stage then we should pick the first one?
  // Should probably set this elsewhere - but this will do for the minute
  if (!currentStage && stages.length > 0) {
    setSelectedStage(stages[0].id)
  }

  // Add Assets
  const clearMatches = useStoreActions(
    actions => actions.matching.match.clearMatches
  )

  const handleImport = (stage: Stage | undefined) => {
    clearMatches()
    importFiles(stage)
      .then(res => {
        console.log(res)

        let message = ''
        let options = {
          type: 'negative' as validIToastOptsTypes,
          autoDismiss: true,
        }
        if (res.data.importFail.length === 0) {
          options = { type: 'positive', autoDismiss: true }
          message = `${res.data.importSuccess.length} ${
            res.data.importSuccess.length > 1 ? 'files' : 'file'
          } imported successfully!`
        } else if (
          res.data.importFail.length > 0 &&
          res.data.importSuccess.length !== 0
        ) {
          options = {
            type: 'informative' as validIToastOptsTypes,
            autoDismiss: false,
          }
          message = `${res.data.importSuccess.length} ${
            res.data.importSuccess.length > 0 ? 'imports' : 'import'
          } were successful, but ${
            res.data.importFail.length
          } failed:\n ${res.data.importFail.join('\n')}`
        } else {
          options = {
            type: 'negative' as validIToastOptsTypes,
            autoDismiss: false,
          }
          message = `${res.data.importFail.length} ${
            res.data.importSuccess.length > 0 ? 'imports' : 'import'
          } Failed! \n\n ${res.data.importFail.join('\n')}`
        }

        addToast(message, options)
      })
      .catch(err => {
        if (err.message === 'No Repository configured') {
          // No repos for this stage. So we have to create or assign an existing one.
          setModalIsOpen(true)
        } else {
          addToast(err.message, { type: 'negative' })
        }
      })
  }

  return (
    <Box p={theme.s2} bg={theme.grayDark} bb={theme.darkStroke}>
      <Flex align='center' justify='space-between' direction='row'>
        <Flex align='center' height='100%'>
          <Heading size='xlarge' m={`0 ${theme.s3}`}>
            Assets
          </Heading>
          {currentProjectFromState && stages.length && currentStage && (
            <StageSelector
              selected={currentStage}
              stages={stages}
              onSelect={stage => setSelectedStage(stage.id)}
            />
          )}
          <Flex justify='flex-end'>
            <AssetsZoomBar zoom={assetsZoom} onChange={setAssetsZoom} />
            <Button
              onClick={() => handleImport(currentStage)}
              secondary
              iconLeft='plus-large'
              color={theme.grayLight}
              padding={theme.s1 + ' ' + theme.s1}
            >
              add assets
            </Button>
            {!isRightPanelOpen && (
              <Box
                ml={theme.s2}
                bl={theme.darkStroke}
                p={`${theme.s0} ${theme.s2}`}
              >
                <Button
                  onClick={() => toggleRightPanel(!isRightPanelOpen)}
                  color={theme.textLight}
                  icon='menu-left'
                />
              </Box>
            )}
          </Flex>
        </Flex>
      </Flex>
      {modalIsOpen && (
        <ConfigureRepoModal
          isOpen={modalIsOpen}
          onCloseRequest={() => setModalIsOpen(false)}
        />
      )}
    </Box>
  )
}
