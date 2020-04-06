import * as React from 'react'
import {
  Modal,
  Box,
  Flex,
  Button,
  Heading,
  Text,
  theme,
  Select,
  useToasts,
} from '@components/shared'
import { useStoreActions, useStoreState } from '@redux/store'
import { Repository } from '@models/Repository'
import { buildSubscription } from '@models/Subscription'

/**
 * --------------------------------------------------
 *  Assign Repo Modal
 * --------------------------------------------------
 */

export interface AssignRepoModal {
  isOpen: boolean
  onCloseRequest: () => void
  openCreateRepo: () => void
  availableRepositories: Repository[]
}

export const AssignRepoModal = (props: AssignRepoModal) => {
  const { addToast } = useToasts()
  const stage = useStoreState(s => s.workflowPerspective.stage.current)
  const addRepoToStage = useStoreActions(
    a => a.workflowPerspective.repository.addRepoToStage
  )

  const handleCreateNewRepo = () => {
    props.onCloseRequest()
    props.openCreateRepo()
  }

  const [selectedRepository, setselectedRepository] = React.useState(
    props.availableRepositories.length > 0
      ? props.availableRepositories[0].id
      : ''
  )

  const handleAssignRepo = () => {
    const repository = props.availableRepositories.find(
      r => r.id === selectedRepository
    )
    if (stage && repository) {
      addRepoToStage(buildSubscription({ repository, stage })).catch(err => {
        console.error(err)
        addToast('Could not assign repository to stage', { type: 'negative' })
      })
    }
    props.onCloseRequest()
  }

  return (
    <Modal
      isOpen={props.isOpen}
      handleCloseRequest={() => props.onCloseRequest()}
      shouldCloseOnOverlayClick={false}
    >
      <Flex p={theme.s3}>
        <Box width='650px' height='270px'>
          <Flex direction='row' justify='space-between' mb='20px'>
            <Heading size={'large'}>
              Assign Repository to {stage && stage.name}
            </Heading>
            <Button
              onClick={() => props.onCloseRequest()}
              icon='close-large'
              color={theme.grayLighter}
            />
          </Flex>
          <Flex direction='column' justify='center' mb='20px'>
            <Select
              label='Choose Repository'
              showLabel
              icon='file'
              mb={theme.s2}
              w='100%'
              initialValue={selectedRepository}
              handleChange={setselectedRepository}
            >
              {props.availableRepositories.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </Select>

            <Text
              small
              color={theme.grayLight}
              mt={theme.s2}
              onClick={handleCreateNewRepo}
            >
              Create new repository...
            </Text>
          </Flex>
          <Flex direction='row' justify='space-between'>
            <Button
              onClick={() => props.onCloseRequest()}
              secondary
              color={theme.grayLight}
            >
              Cancel
            </Button>
            <Button iconLeft='tick' onClick={handleAssignRepo}>
              Save Settings
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Modal>
  )
}
