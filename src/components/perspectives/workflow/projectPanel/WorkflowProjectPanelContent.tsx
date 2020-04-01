import * as React from 'react'
import pluralize from 'pluralize'

import { LoupeRealmErrorResponse } from '@models/ipc'
import { Stage } from '@models'
import { useStoreState, useStoreActions } from '@redux/store'
import {
  Button,
  Box,
  Flex,
  Heading,
  theme,
  useToasts,
  PopOver,
  SaveTemplateModal,
} from '@components/shared'

export interface WorkflowProjectPanelContent {}

const StageToastContent = ({
  action,
  stagesCount,
}: {
  action: string
  stagesCount: number
}) => {
  return (
    <>
      Stage {action} and visible on{' '}
      <strong>
        {stagesCount} workflow {pluralize('sections', stagesCount)}
      </strong>
      .
    </>
  )
}

export const WorkflowProjectPanelContent = () => {
  const { addToast } = useToasts()
  const isRightPanelOpen = useStoreState(s => s.app.isRightPanelOpen)
  const toggleRightPanel = useStoreActions(a => a.app.toggleRightPanel)
  const createNewStage = useStoreActions(
    a => a.workflowPerspective.stage.create
  )
  const saveWorkflowTemplate = useStoreActions(
    a => a.workflowPerspective.template.saveWorkflowTemplate
  )
  const [modalIsOpen, setModalIsOpen] = React.useState(false)

  const handleCreateStage = () => {
    createNewStage(undefined)
      .then(({ data: stage }: { data: Stage }) => {
        addToast(
          <StageToastContent
            action='created'
            stagesCount={stage.sectionIds.length}
          />
        )
      })
      .catch((err: LoupeRealmErrorResponse) => {
        addToast(err.message, { type: 'negative' })
      })
  }

  return (
    <Box p={theme.s2} bg={theme.grayDark} bb={theme.darkStroke}>
      <Flex align='center' justify='space-between' direction='row'>
        <Flex align='center' height='100%'>
          <Heading size='xlarge' m='0' ml={theme.s3}>
            Workflow
          </Heading>
        </Flex>
        <Flex flex={0}>
          <Button
            onClick={handleCreateStage}
            secondary
            iconLeft='plus-large'
            color={theme.grayLight}
            padding={theme.s1 + ' ' + theme.s1}
          >
            Add&nbsp;Stage
          </Button>
          <PopOver
            below={true}
            width='250px'
            content={
              <>
                <Button
                  text
                  color={'blue'}
                  onClick={() => setModalIsOpen(true)}
                >
                  Save Workflow Template
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
          templateType='Workflow'
          saveTemplate={saveWorkflowTemplate}
        />
      )}
    </Box>
  )
}
