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
import { SaveTemplatePayload } from '@models'
import { LoupeRealmResponse } from '@models/ipc'

/**
 * --------------------------------------------------
 *  Template Save Modal
 * --------------------------------------------------
 */

export interface SaveTemplateModal {
  isOpen: boolean
  onCloseRequest: () => void
  templateType: 'Brief' | 'Tree' | 'Workflow'
  saveTemplate: (payload: SaveTemplatePayload) => Promise<LoupeRealmResponse>
}

export const SaveTemplateModal = (props: SaveTemplateModal) => {
  const { addToast } = useToasts()
  const [templateName, setTemplateName] = React.useState('')

  const getOptions = () => {
    switch (props.templateType) {
      case 'Brief':
        return {
          includeSections: true,
          includeElements: true,
          includeFieldDefinitions: true,
        }
      case 'Tree':
        return {
          includeTreeDefinitions: true,
          includeTreeInstances: true,
        }
      case 'Workflow':
        return {
          includeStages: true,
          includeTransitions: true,
        }
      default:
        return {}
    }
  }

  const handleNameChange = (name: string) => {
    // TODO: Validate that template name does not already exist?
    setTemplateName(name)
  }

  const handleSaveTemplate = () => {
    props
      .saveTemplate({ name: templateName, ...getOptions() })
      .then(res => {
        console.log('SaveTemplateResponse ->', res)
        addToast('Template Saved')
        props.onCloseRequest()
      })
      .catch(err => {
        console.error(err)
        addToast('Failed to save template!')
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
            <Heading
              size={'medium'}
            >{`Save ${props.templateType} Template`}</Heading>
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
                <pre>{`Need designs for this.`}</pre>
              </Text>
              {templateName !== '' ? (
                <Button onClick={handleSaveTemplate}>
                  {`Save ${props.templateType} Template`}
                </Button>
              ) : (
                <Button
                  disabled
                >{`Save ${props.templateType} Template`}</Button>
              )}
            </Box>
          </Box>
        </Flex>
      </Box>
    </Modal>
  )
}
