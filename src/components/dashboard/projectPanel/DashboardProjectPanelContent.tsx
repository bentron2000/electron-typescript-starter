import * as React from 'react'
import { Button, Box, Flex, Heading, theme } from '@components/shared'
import { useStoreState, useStoreActions } from '@redux/store'
import { NewProjectModal } from '.'

export const DashboardProjectPanelContent = () => {
  const isRightPanelOpen = useStoreState(s => s.app.isRightPanelOpen)
  const toggleRightPanel = useStoreActions(a => a.app.toggleRightPanel)
  const [modalIsOpen, setModalIsOpen] = React.useState(false)

  return (
    <Box p={theme.s2} bg={theme.grayDark} bb={theme.darkStroke}>
      <Flex align='center' justify='space-between' direction='row'>
        <Flex align='center' height='100%'>
          <Heading size='xlarge' m='0' ml={theme.s3}>
            Dashboard
          </Heading>
        </Flex>
        <Flex flex={0}>
          <Button
            onClick={() => setModalIsOpen(true)}
            secondary
            iconLeft='plus-large'
            color={theme.primary}
            padding={theme.s1 + ' ' + theme.s1}
          >
            START&nbsp;NEW&nbsp;PROJECT
          </Button>
          <Button
            onClick={() => undefined}
            secondary
            ml='9px'
            icon='more'
            color={theme.grayLight}
            padding={theme.s1 + ' ' + theme.s1}
          />
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
        <NewProjectModal
          isOpen={modalIsOpen}
          onCloseRequest={() => setModalIsOpen(false)}
        />
      )}
    </Box>
  )
}
