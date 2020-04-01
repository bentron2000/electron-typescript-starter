import * as React from 'react'
import { useStoreState, useStoreActions } from '@redux/store'
import { RouteComponentProps } from 'react-router'

import { Box, Text, Icon, Flex, Button } from '../../shared'
import { theme } from '../../shared/Theme/theme'

export interface MatchingActionPanelContent {
  match: RouteComponentProps
}

export const MatchingActionPanelContent = (
  props: MatchingActionPanelContent
) => {
  const restoreRP = useStoreActions(actions => actions.app.toggleRightPanel)
  const previousRP = useStoreState(state => state.matching.ui.rightPanelWasOpen)
  const closeMatching = useStoreActions(
    actions => actions.matching.ui.closeMatching
  )
  const matches = useStoreState(state => state.matching.match.matches)
  const performMatching = useStoreActions(a => a.matching.match.executeMatches)

  const executeMatches = async () => {
    await closeMatching()
    await restoreRP(previousRP)
    props.match.history.goBack()
    performMatching()
  }

  const numMatches = [...Object.values(matches)].flatMap(m => m.assets).length
  const disabled = { disabled: !numMatches }
  const handleClick = () => (!!numMatches ? executeMatches() : undefined)

  return (
    <Box
      color={theme.green}
      p={theme.s2}
      bg={theme.grayDark}
      bt={theme.darkStroke}>
      <Flex align='center' justify='flex-end' direction='row'>
        {numMatches > 0 && (
          <>
            <Icon name='tick' width='24px' />
            <Text ml={theme.s2} mb='0' subtitle color={theme.green}>
              {numMatches}
              &nbsp;Assets&nbsp;Matched
            </Text>
          </>
        )}
        <Button
          iconLeft='tick'
          ml={theme.s2}
          onClick={handleClick}
          {...disabled}>
          Finish&nbsp;Matching
        </Button>
      </Flex>
    </Box>
  )
}
