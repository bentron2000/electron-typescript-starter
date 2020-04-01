import * as React from 'react'
import {
  Modal,
  Box,
  Flex,
  Button,
  Heading,
  Text,
  theme,
} from '@components/shared'
import { useStoreActions, useStoreState } from '@redux/store'
import { Repository } from '@models'

/**
 * --------------------------------------------------
 * Configure Repo Modal
 * --------------------------------------------------
 */

export interface ConfigureRepoModal {
  isOpen: boolean | undefined
  onCloseRequest: () => void
  onConfigureCompleteAction?: (repository: Repository) => void
}

export const ConfigureRepoModal = (props: ConfigureRepoModal) => {
  const [repoName, setrepoName] = React.useState('')
  const location = useStoreState(s => s.user.repositories.newRepositoryLocation)
  const chooseLocation = useStoreActions(
    a => a.user.repositories.selectRepositoryLocation
  )
  const createRepo = useStoreActions(a => a.user.repositories.createRepository)

  const handleSelectLocation = () => {
    chooseLocation()
      .then(res => {
        setrepoName(res.data.name)
      })
      .catch(err => console.error('failed', err))
  }

  const handleCreateRepo = () => {
    createRepo({ name: repoName }).then(res => {
      console.log('created repo', res)
      if (props.onConfigureCompleteAction) {
        props.onConfigureCompleteAction(res.data)
      }
    })
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
          <Flex direction='row' justify='space-between'>
            <Heading size={'large'}>Setup Repository</Heading>
            <Button
              onClick={() => props.onCloseRequest()}
              icon='close-large'
              color={theme.grayLighter}
            />
          </Flex>
          <Flex
            align='center'
            height='180px'
            direction='column'
            justify='center'
          >
            <Text small mb={theme.s3}>
              To sync assets between Loupe and your computer, select a location
              on your drive:
            </Text>
            <Button secondary onClick={handleSelectLocation}>
              SELECT DRIVE LOCATION
            </Button>
            <Text small color={theme.grayLight} mt={theme.s2}>
              {location}
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
            <Button onClick={handleCreateRepo} iconLeft='tick'>
              Save Settings
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Modal>
  )
}
