import * as React from 'react'
import { useStoreState, useStoreActions } from '@redux/store'

import {
  Button,
  Box,
  Flex,
  Heading,
  theme,
  PopOver,
  SaveTemplateModal,
} from '@components/shared'

export const TreeProjectPanelContent = () => {
  const isRightPanelOpen = useStoreState(store => store.app.isRightPanelOpen)
  const toggleRightPanel = useStoreActions(
    actions => actions.app.toggleRightPanel
  )
  const saveTreeTemplate = useStoreActions(
    a => a.treePerspective.template.saveTreeTemplate
  )
  const [modalIsOpen, setModalIsOpen] = React.useState(false)

  return (
    <Box p={theme.s2} bg={theme.grayDark} bb={theme.darkStroke}>
      <Flex align='center' justify='space-between' direction='row'>
        <Heading size='xlarge' m='0' ml={theme.s3}>
          Tree
        </Heading>
        <Flex flex={0}>
          <PopOver
            below={true}
            width='200px'
            content={
              <>
                <Button
                  text
                  color={'blue'}
                  onClick={() => setModalIsOpen(true)}
                >
                  Save Tree Template
                </Button>
              </>
            }
          >
            <Button
              onClick={() => undefined}
              secondary
              ml='9px'
              icon='more'
              color={theme.grayLight}
              padding={theme.s1 + ' ' + theme.s1}
            />
          </PopOver>
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
      {modalIsOpen && (
        <SaveTemplateModal
          isOpen={modalIsOpen}
          onCloseRequest={() => setModalIsOpen(false)}
          templateType='Tree'
          saveTemplate={saveTreeTemplate}
        />
      )}
    </Box>
  )
}
