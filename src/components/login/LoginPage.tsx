import * as React from 'react'
import { useStoreActions } from '@redux/store'

import { Button, Box, Flex, Heading } from '../shared'
import { ElectronHeader } from '../shared/electronHeader/ElectronHeader'
import { theme } from '../shared/Theme/theme'

export interface LoginPage {}

export const LoginPage = () => {
  const login = useStoreActions(actions => actions.app.tryLogin)

  const ben = {
    id: 'ben',
    name: 'Benjamin',
    pass: 'ben',
    sync: true,
    mockdata: 'sequitur',
  }

  const jules = {
    id: 'ben',
    name: 'Benjamin',
    pass: 'ben',
    sync: true,
    mockdata: 'sequitur',
  }

  const naomi = {
    id: 'u1',
    name: 'Local User 1 - Naomi',
    pass: '',
    sync: false,
    mockdata: 'sequitur',
  }

  const grippi = {
    id: 'u2',
    name: 'Local User 2 - Grippi',
    pass: '',
    sync: false,
    mockdata: 'sequitur',
  }

  return (
    <Box bg={theme.grayDarker} width={'100%'}>
      <Flex height='100vh' direction='column'>
        <ElectronHeader />
        <Flex justify='center' align='center' direction='column'>
          <Heading large color={theme.grayLight}>
            Loupe
          </Heading>
          <Box>&nbsp;</Box>
          <Button onClick={() => login(ben)}>Login as 'Ben (sync)'</Button>
          <Box>&nbsp;</Box>
          <Button onClick={() => login(jules)}>Login as 'Jules (sync)'</Button>
          <Box>&nbsp;</Box>
          <Button onClick={() => login(naomi)}>Login as 'Naomi (Local)'</Button>
          <Box>&nbsp;</Box>
          <Button onClick={() => login(grippi)}>
            Login as 'Grippi (Local)'
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}
