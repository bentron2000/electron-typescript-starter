import * as React from 'react'
import {
  Modal,
  Box,
  Flex,
  Button,
  Heading,
  Text,
  Input,
  theme,
  useToasts,
} from '@components/shared'
import { useStoreActions } from '@redux/store'

/**
 * --------------------------------------------------
 * Project Template Save Modal
 * --------------------------------------------------
 */

export interface ProjectTemplateSaveModal {
  projectId: string
  isOpen: boolean
  onCloseRequest: () => void
}

export const ProjectTemplateSaveModal = (props: ProjectTemplateSaveModal) => {
  console.log(props)
  const { addToast } = useToasts()
  const saveTemplate = useStoreActions(
    a => a.briefPerspective.template.saveBriefTemplate
  )

  const [templateName, setTemplateName] = React.useState('')
  const templateOptions = {
    projectId: props.projectId,
    includeSections: true,
    includeElements: true,
    includeFieldDefinitions: true,
    includeStages: true,
    includeTransitions: true,
    includeSectionPermissions: true,
    includeTreeDefinitions: true,
    includeTreeInstances: true,
  }

  const handleNameChange = (name: string) => {
    // TODO: Validate that template name does not already exist?
    setTemplateName(name)
  }

  const handleSaveProjectTemplate = () => {
    saveTemplate({ name: templateName, ...templateOptions })
      .then(res => {
        console.log('SaveTemplateResponse ->', res)
        addToast('Template Saved')
        props.onCloseRequest()
      })
      .catch(err => {
        console.error(err)
        addToast('Failed to save template!', { type: 'negative' })
      })
  }

  return (
    <Modal
      isOpen={props.isOpen}
      handleCloseRequest={() => props.onCloseRequest()}
      shouldCloseOnOverlayClick={true}
    >
      <Box width='500px' height='500px'>
        <Flex direction='column' height='100%'>
          <Box width='100%' m={theme.s3}>
            <Heading size={'medium'}>Save Project Template</Heading>
            <Box width='100%'>
              <Input
                width={'100%'}
                label={'name'}
                showLabel={true}
                placeholder={'Untitled Template'}
                onBlur={handleNameChange}
                onChange={handleNameChange}
              />
              <Text body>
                <pre>{`Need designs for this.\nSee notes in code.`}</pre>
              </Text>
              {templateName !== '' ? (
                <Button onClick={handleSaveProjectTemplate}>
                  Save Project Template
                </Button>
              ) : (
                <Button disabled>Save Project Template</Button>
              )}
            </Box>
          </Box>
        </Flex>
      </Box>
    </Modal>
  )
}
