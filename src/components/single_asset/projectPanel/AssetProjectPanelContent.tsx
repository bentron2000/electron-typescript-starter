import * as React from 'react'
import { useStoreState, useStoreActions } from '@redux/store'
import { AssetsZoomBar, Button, Box, Flex, Heading } from '../../shared'
import { theme } from '../../shared/Theme/theme'
import { RouteComponentProps } from 'react-router'

export interface AssetProjectPanelContent {
  match: RouteComponentProps
}

export const AssetProjectPanelContent = (props: AssetProjectPanelContent) => {
  const isRightPanelOpen = useStoreState(s => s.app.isRightPanelOpen)
  const toggleRightPanel = useStoreActions(a => a.app.toggleRightPanel)
  const currentMediaState = useStoreState(
    s => s.assetPerspective.mediaState.current
  )
  const setCurrentMediaState = useStoreActions(
    a => a.assetPerspective.mediaState.set
  )
  const assetZoom = useStoreState(s => s.singleAsset.ui.assetZoom)
  const setAssetZoom = useStoreActions(a => a.singleAsset.ui.setAssetZoom)
  const setRightPanelTitle = useStoreActions(
    actions => actions.app.setRightPanelTitle
  )

  const closeAction = () => {
    setCurrentMediaState(undefined)
    props.match.history.goBack()
    setRightPanelTitle('Asset Perspective')
  }

  return (
    <Box p={theme.s2} bg={theme.grayDark} bb={theme.darkStroke}>
      <Flex flex={1} direction='row' justify='space-between'>
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
            {currentMediaState ? currentMediaState.name : ''}
          </Heading>
        </Flex>
        <Flex flex={0}>
          <AssetsZoomBar zoom={assetZoom} onChange={setAssetZoom} />
          <Button
            secondary
            iconLeft='plus-large'
            color={theme.grayLight}
            padding={theme.s1 + ' ' + theme.s1}>
            ADD&nbsp;TO&nbsp;BRIEF
          </Button>
          {!isRightPanelOpen && (
            <Box
              ml={theme.s2}
              bl={theme.darkStroke}
              p={`${theme.s0} ${theme.s2}`}>
              <Button
                onClick={() => toggleRightPanel(!isRightPanelOpen)}
                color={theme.textLight}
                icon='menu-left'
              />
            </Box>
          )}
        </Flex>
      </Flex>
    </Box>
  )
}
