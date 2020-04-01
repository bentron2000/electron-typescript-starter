import * as React from 'react'
import { useStoreActions, useStoreState } from '@redux/store'
import { AssetsZoomBar, Button, Box, Flex, Heading } from '../../shared'
import { theme } from '../../shared/Theme/theme'
import { RouteComponentProps } from 'react-router'
import { clearUnmatchedPendingAssets } from '@models/PendingAsset'

export interface MatchingProjectPanelContent {
  match: RouteComponentProps
}

export const MatchingProjectPanelContent = (
  props: MatchingProjectPanelContent
) => {
  const closeMatching = useStoreActions(
    actions => actions.matching.ui.closeMatching
  )
  const clearMatches = useStoreActions(
    actions => actions.matching.match.clearMatches
  )
  const restoreRP = useStoreActions(actions => actions.app.toggleRightPanel)
  const previousRP = useStoreState(state => state.matching.ui.rightPanelWasOpen)
  const currentStage = useStoreState(
    state => state.assetPerspective.stage.current
  )
  const closeAction = async () => {
    await closeMatching()
    await restoreRP(previousRP)
    clearMatches()
    props.match.history.goBack()
    if (currentStage) {
      clearUnmatchedPendingAssets(currentStage)
    }
  }
  const zoom = useStoreState(state => state.matching.ui.zoom)
  const setZoom = useStoreActions(actions => actions.matching.ui.setZoom)

  return (
    <Box p={theme.s2} bg={theme.grayDark} bb={theme.darkStroke}>
      <Flex direction='row' justify='space-between'>
        <Flex>
          <Button
            hoverColor='white'
            icon='back'
            iconWidth='32px'
            padding='0'
            ml={theme.s3}
            color={theme.grayLight}
            onClick={() => closeAction()}
          />
          <Heading size='xlarge' mb='0' ml={theme.s3}>
            Match Assets
          </Heading>
        </Flex>
        <Flex flex={0}>
          <AssetsZoomBar
            reversed={true}
            width='120px'
            min={2}
            max={4}
            zoom={zoom}
            onChange={setZoom}
          />
        </Flex>
      </Flex>
    </Box>
  )
}
