import * as React from 'react'
import {
  Subsection,
  Flex,
  Button,
  Text,
  theme,
  Checkbox,
  Box,
  useToasts,
} from '@components/shared'
import { Stage } from '@models/Stage'
import { Repository } from '@models/Repository'
import { ConfigureRepoModal } from '@components/shared/createRepositoryModal/ConfigureRepoModal'
import { AssignRepoModal } from '..'
import { useStoreState, useStoreActions } from '@redux/store'
import { buildSubscription } from '@models/Subscription'

// 'add repository' allows selection of existing repo
// or, creation of a new one if the seat/team doesn't have one

interface WorkflowRepositoriesPane {
  currentStage: Stage | undefined
}

const getIconString = (type: string) => {
  switch (type) {
    case 'local':
      return 'file'
    case 'loupe':
      return 'upload'
    default:
      return 'file'
  }
}
const getSubtitle = (repo: Repository) =>
  `${repo.ownerName} • ${repo.config.type ? repo.config.type + ', ' : ''}${
    repo.numStages
  } Stages`

export const WorkflowRepositoriesPane = (props: WorkflowRepositoriesPane) => {
  const { addToast } = useToasts()
  const seat = useStoreState(s => s.user.seats.current)
  const addRepoToStage = useStoreActions(
    a => a.workflowPerspective.repository.addRepoToStage
  )
  const removeRepo = useStoreActions(
    a => a.workflowPerspective.repository.removeRepoFromStage
  )

  const [assignRepoModalIsOpen, setAssignRepoModalIsOpen] = React.useState(
    false
  )
  const [configRepoModalIsOpen, setConfigRepoModalIsOpen] = React.useState(
    false
  )

  const handleRemoveRepo = (repository: Repository) => {
    if (repository && props.currentStage) {
      removeRepo(buildSubscription({ repository, stage: props.currentStage }))
    }
  }

  const availableRepositories = seat
    ? seat.repositories.filter(
        r =>
          !(props.currentStage
            ? props.currentStage.repositories.map(s => s.id)
            : []
          ).includes(r.id)
      )
    : []

  const handleAddRepo = () => {
    const hasRepos = (seat ? seat.repositories.length : 0) > 0
    const hasAvailableRepos = availableRepositories.length > 0
    console.log('has repos', hasRepos)
    if (hasRepos && hasAvailableRepos) {
      setAssignRepoModalIsOpen(true)
    } else {
      setConfigRepoModalIsOpen(true)
    }
  }

  const addRepoOnConfigure = (repository: Repository) => {
    if (props.currentStage && repository) {
      addRepoToStage(
        buildSubscription({ repository, stage: props.currentStage })
      ).catch(err => {
        console.error(err)
        addToast('Could not assign repository to stage', { type: 'negative' })
      })
    }
  }

  const renderRepos = () =>
    props.currentStage &&
    props.currentStage.repositories.map(r => (
      <Subsection
        key={r.id}
        icon={getIconString(r.config.type ? r.config.type : '')}
        heading={
          <Flex direction='row' justify='space-between'>
            <Text subtitle>{r.name}</Text>
            <Button
              icon='close'
              color={theme.grayLight}
              onClick={() => handleRemoveRepo(r)}
            />
            Button>
          </Flex>
        }
        subtitle={getSubtitle(r)}
      />
    ))

  return (
    <Flex direction='column'>
      {!props.currentStage && (
        <Box>
          <Text body>Select a stage...</Text>
        </Box>
      )}
      {props.currentStage && renderRepos()}
      {props.currentStage && (
        <Subsection
          heading={
            <Box>
              <Box mb='5px'>
                <Button
                  onClick={handleAddRepo}
                  padding='0'
                  iconLeft='plus'
                  secondary
                  text
                >
                  Add Repository
                </Button>
              </Box>
              <Box p={theme.s2}>
                <Text color={theme.textLight} subtitle>
                  Settings
                </Text>
                <Checkbox checked={true}>
                  Allow users to connect their own repositories
                </Checkbox>
              </Box>
            </Box>
          }
        />
      )}
      {configRepoModalIsOpen && (
        <ConfigureRepoModal
          isOpen={configRepoModalIsOpen}
          onCloseRequest={() => setConfigRepoModalIsOpen(false)}
          onConfigureCompleteAction={addRepoOnConfigure}
        />
      )}
      {assignRepoModalIsOpen && (
        <AssignRepoModal
          isOpen={assignRepoModalIsOpen}
          openCreateRepo={() => setConfigRepoModalIsOpen(true)}
          availableRepositories={availableRepositories}
          onCloseRequest={() => setAssignRepoModalIsOpen(false)}
        />
      )}
    </Flex>
  )
}
