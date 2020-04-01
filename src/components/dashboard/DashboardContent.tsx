import * as React from 'react'
import { useStoreState, useStoreActions } from '@redux/store'
import { Box, Heading, Button, Text, Flex, Grid, PopOver } from '../shared'
import { theme } from '../shared/Theme/theme'
import { Link } from 'react-router-dom'
import { ProjectTemplateSaveModal } from './ProjectTemplateSaveModal'

export interface DashboardContent {}

export const DashboardContent = () => {
  const projects = useStoreState(s => s.user.projects.all)
  const clearProject = useStoreActions(a => a.project.clear)
  const selectProject = useStoreActions(a => a.project.fetch)
  const updatePerspectiveData = useStoreActions(
    a => a.app.updatePerspectiveData
  )
  const currentProject = useStoreState(s => s.project.current)

  const [modalIsOpen, setModalIsOpen] = React.useState(false)
  const [projectId, setprojectId] = React.useState<string | undefined>()

  React.useEffect(() => {
    updatePerspectiveData({ id: 'dashboard', data: { rhpTitle: 'Dashboard' } })
    if (currentProject) {
      clearProject()
    }
  })

  const handleCreateTemplate = (projId: string) => {
    setprojectId(projId)
    setModalIsOpen(true)
  }

  return (
    <Box bg={theme.grayDarker} width={'100%'} p={theme.s4} overflow='scroll'>
      <Flex direction='column'>
        <Heading large color={theme.grayLight}>
          Dashboard
        </Heading>
        <Grid zoom={2}>
          {projects ? (
            projects.map(project => (
              <Box m='5px' key={project.id}>
                <Flex direction='row'>
                  <Link
                    to={`/project/${project.id}/brief`}
                    style={{ textDecoration: 'none' }}
                  >
                    <Button
                      onClick={() => {
                        selectProject(project.id)
                        updatePerspectiveData({
                          id: 'brief',
                          data: { rhpTitle: `Brief Perspective` },
                        })
                      }}
                    >
                      {project.name}
                    </Button>
                  </Link>
                  <PopOver
                    width='200px'
                    content={
                      <>
                        <Button
                          text
                          color={'red'}
                          onClick={() => handleCreateTemplate(project.id)}
                        >
                          Save Template
                        </Button>
                      </>
                    }
                  >
                    <Button
                      icon='more'
                      color={theme.grayLighter}
                      padding={theme.s2}
                      hoverColor='white'
                    />
                  </PopOver>
                </Flex>
              </Box>
            ))
          ) : (
            <Text>No Projects</Text>
          )}
        </Grid>
      </Flex>
      {modalIsOpen && projectId && (
        <ProjectTemplateSaveModal
          projectId={projectId}
          isOpen={modalIsOpen}
          onCloseRequest={() => setModalIsOpen(false)}
        />
      )}
    </Box>
  )
}
