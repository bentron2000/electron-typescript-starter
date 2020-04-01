import * as React from 'react'
import styled from 'styled-components'
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router-dom'
import { useStoreState, useStoreActions } from '@redux/store'
import {
  Heading,
  Box,
  Accordion,
  Flex,
  Text,
  Button,
  InlineEdit,
} from '../shared'
import { theme } from '../shared/Theme/theme'
import { BriefRightPanelProvider } from '../perspectives/brief'
import { TreeRightPanelProvider } from '../perspectives/tree'
import { WorkflowRightPanelProvider } from '../perspectives/workflow'
import { AssetsRightPanelProvider } from '../perspectives/assets'
import { AssetRightPanelProvider } from '../single_asset'
import { DashboardRightPanelProvider } from '../dashboard'

const RightPanelBox = styled(Box)`
  display: flex;
  flex-direction: column;
`

const RightPanelMenu = (props: Accordion) => (
  <Flex height='100%' direction='column'>
    <Accordion sticky {...props} />
  </Flex>
)

interface RHP {
  // Require functions for these
  title?: string
  saveDesc?: (string: string) => void
  sanitizeDesc?: (string: string) => string
  validateDesc?: (string: string) => boolean
}

export const RightPanelSwitch = withRouter(
  ({ history, ...props }: RHP & RouteComponentProps) => {
  const saveDesc = () => '' // TODO implement save funcs
  const shouldBeOpen = useStoreState(state => state.app.isRightPanelOpen)
  const currentPerspective = useStoreState(
    state => state.app.currentPerspective
  )
  const rhpsSetAllUnlocked = useStoreActions(a => a.app.setAllRhpsUnlocked)

  const toggleRightPanel = useStoreActions(
    actions => actions.app.toggleRightPanel
  )
  const [rhpTitle, setRhpTitle] = React.useState(
    currentPerspective ? currentPerspective.data.rhpTitle : ''
  )

  React.useEffect(() => {
    setRhpTitle(currentPerspective ? currentPerspective.data.rhpTitle : '')
  }, [currentPerspective])

  React.useEffect(() => {
    rhpsSetAllUnlocked()
  }, [history.location.key])

  const RightPanelTitle = (prp: RHP) => (
    <Heading medium mt={theme.s3} mb={theme.s3} mr={theme.s3}>
      {prp.title}
    </Heading>
  )

  return shouldBeOpen ? (
    <RightPanelBox width='320px' bg={theme.grayDark} bl={theme.darkStroke}>
      <Box>
        <Flex>
          {shouldBeOpen && (
            <Flex flex={0} align='center'>
              <Button
                ml={theme.s2}
                mr={theme.s2}
                onClick={() => toggleRightPanel(!shouldBeOpen)}
                color={theme.textLight}
                icon='menu-right'
              />
            </Flex>
          )}
          <RightPanelTitle title={rhpTitle} />
        </Flex>
      </Box>
      <Box p={theme.s3} bt={theme.darkStroke} bb={theme.darkStroke}>
        <Box mr={theme.s3}>
          <InlineEdit
            saveContent={saveDesc}
            sanitizeContent={props.sanitizeDesc}
            validateContent={props.validateDesc}
            p={theme.s2}
          >
            <Text small color={theme.textLight} mb={theme.s0}>
              This stage is to allow art directors the opportunity to add
              feedback on assets before sending for retouching.
            </Text>
          </InlineEdit>
        </Box>
      </Box>
      <Switch>
        <Route
          path='/project/:projectID/brief'
          exact
          render={() => (
            <BriefRightPanelProvider>
              {(prps: Accordion) => <RightPanelMenu {...prps} />}
            </BriefRightPanelProvider>
          )}
        />
        <Route
          path='/project/:projectID/tree'
          exact
          render={() => (
            <TreeRightPanelProvider>
              {(prps: Accordion) => <RightPanelMenu {...prps} />}
            </TreeRightPanelProvider>
          )}
        />
        <Route
          path='/project/:projectID/workflow'
          exact
          render={() => (
            <WorkflowRightPanelProvider>
              {(prps: Accordion) => <RightPanelMenu {...prps} />}
            </WorkflowRightPanelProvider>
          )}
        />
        <Route
          path='/project/:projectID/assets'
          exact
          render={() => (
            <AssetsRightPanelProvider>
              {(prps: Accordion) => <RightPanelMenu {...prps} />}
            </AssetsRightPanelProvider>
          )}
        />
        <Route
          path='/project/:projectID/single-asset'
          exact
          render={() => (
            <AssetRightPanelProvider>
              {(prps: Accordion) => <RightPanelMenu {...prps} />}
            </AssetRightPanelProvider>
          )}
        />
        <Route
          path='/'
          render={() => (
            <DashboardRightPanelProvider>
              {(prps: Accordion) => <RightPanelMenu {...prps} />}
            </DashboardRightPanelProvider>
          )}
        />
      </Switch>
    </RightPanelBox>
  ) : (
    <div />
  )
})
