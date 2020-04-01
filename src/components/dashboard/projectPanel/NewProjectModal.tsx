import * as React from 'react'
import {
  Modal,
  Box,
  Flex,
  Button,
  Heading,
  Input,
  Select,
  theme,
  useToasts,
} from '@components/shared'
import { useStoreActions, useStoreState } from '@redux/store'
import { importTemplateFile } from '@models/Template'
/**
 * --------------------------------------------------
 * New Project Modal
 * --------------------------------------------------
 */

export interface NewProjectModal {
  isOpen: boolean
  onCloseRequest: () => void
}

export const NewProjectModal = (props: NewProjectModal) => {
  const createProject = useStoreActions(a => a.project.create)
  const refetchUser = useStoreActions(a => a.user.user.refetchUser)
  const team = useStoreState(s => s.user.teams.current)
  const { addToast } = useToasts()
  const [projectName, setProjectName] = React.useState('')
  const [briefTemplate, setBriefTemplate] = React.useState('None')
  const [treeTemplate, setTreeTemplate] = React.useState('None')
  const [workflowTemplate, setWorkflowTemplate] = React.useState('None')

  const templates = (team && team.templates) || []

  const handleLoadTemplateFromFile = () => {
    importTemplateFile(team && team.id)
      .then(res => {
        console.log('Template loaded:', res)
        addToast('Template Loaded')
        refetchUser()
      })
      .catch(err => {
        console.error(err)
        console.error('Template file load error', err)
        addToast('Failed to load template file...', { type: 'negative' })
      })
  }

  const handleCreateProject = () => {
    const options = {
      name: projectName,
      briefTemplate: briefTemplate !== 'None' ? briefTemplate : undefined,
      treeTemplate: treeTemplate !== 'None' ? treeTemplate : undefined,
      workflowTemplate:
        workflowTemplate !== 'None' ? workflowTemplate : undefined,
    }
    createProject(options)
      .then(res => {
        console.log('CreateProjectResponse ->', res)
        addToast('Project Created')
        props.onCloseRequest()
      })
      .catch(err => {
        console.error(err)
        addToast('Failed to create project!', { type: 'negative' })
      })
  }

  return (
    <Modal
      isOpen={props.isOpen}
      handleCloseRequest={() => props.onCloseRequest()}
      shouldCloseOnOverlayClick={true}
    >
      <Box width='600px' height='500px'>
        <Flex direction='column' height='100%' width='550px'>
          <Box width='100%' m={theme.s3}>
            <Heading size={'medium'}>Create New Project</Heading>
            <Box width='100%'>
              <Input
                width={'100%'}
                label={'name'}
                showLabel={true}
                placeholder={'Untitled Project'}
                onBlur={(name: string) => setProjectName(name)}
                onChange={(name: string) => setProjectName(name)}
              />
              <br />
              <br />
              <Select
                label='Brief Template Selector'
                showLabel
                icon='brief'
                mb={theme.s2}
                w='100%'
                handleChange={setBriefTemplate}
              >
                {templates
                  .filter(t => t.sections > 0)
                  .map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                <option key='None' value='None' selected>
                  None
                </option>
              </Select>
              <br />
              <Select
                label='Tree Template Selector'
                showLabel
                icon='tree'
                mb={theme.s2}
                w='100%'
                handleChange={setTreeTemplate}
              >
                {templates
                  .filter(t => t.treeDefinitions > 0)
                  .map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                <option key='None' value='None' selected>
                  None
                </option>
              </Select>
              <br />
              <Select
                label='Workflow Template Selector'
                showLabel
                icon='workflow'
                mb={theme.s2}
                w='100%'
                handleChange={setWorkflowTemplate}
              >
                {templates
                  .filter(t => t.stages > 0)
                  .map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                <option key='None' value='None' selected>
                  None
                </option>
              </Select>
              <br />
              {projectName !== '' ? (
                <Button onClick={handleCreateProject}>Create Project</Button>
              ) : (
                <Button disabled>Create Project</Button>
              )}
              <br />
              <Button onClick={handleLoadTemplateFromFile} text>
                load template from file
              </Button>
            </Box>
          </Box>
        </Flex>
      </Box>
    </Modal>
  )
}
