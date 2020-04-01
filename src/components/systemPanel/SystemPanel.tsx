import * as React from 'react'
import { useStoreState, useStoreActions } from '@redux/store'
import { Box, Flex, Input } from '../shared'
import { theme } from '../shared/Theme/theme'
import {
  SystemPanelBreadcrumb,
  ISystemPanelBreadcrumb
} from './SystemPanelBreadcrumb'

export interface SystemPanel {}

export const SystemPanel = () => {
  const project = useStoreState(state => state.project.current)
  const teams = useStoreState(state => state.user.teams.all)
  const team = useStoreState(state => state.user.teams.current)
  const setTeam = useStoreActions(actions => actions.user.teams.subscribe)
  const currentPerspective = useStoreState(s => s.app.currentPerspective)
  const search = useStoreActions(a => a.app.search.set)

  const props = { team, teams, setTeam, project } as ISystemPanelBreadcrumb
  // TODO: react suspense for lazy loading / spinners.
  return team ? (
    <Box p='1px' bg={theme.grayDark} bb={theme.darkStroke}>
      <Flex>
        <SystemPanelBreadcrumb {...props} />
        {currentPerspective && currentPerspective.id === 'assets' && (
          <Flex direction='column' width='320px' height='0'>
            <Input
              flex
              label='search'
              icon='search'
              width='320px'
              onChange={search}
              onChangeDebounceDuration={300}
              mb={theme.s2}
              placeholder={`Search assets...`}
            />
          </Flex>
        )}
      </Flex>
    </Box>
  ) : (
    <></>
  )
}
