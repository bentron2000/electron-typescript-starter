import * as React from 'react'
import styled from 'styled-components'
import { Route, Redirect } from 'react-router-dom'
import { useStoreState } from '@redux/store'
import { LoginPage } from '@components/login'
import { Flex, ElectronHeader, Snackbar, Box } from '@components/shared'
import { SystemPanel } from '@components/systemPanel'
import {
  PerspectivePanelSwitch,
  ContentPanelSwitch,
  RightPanelSwitch,
  ProjectPanelSwitch,
  ActionPanelSwitch,
} from '@components/switches'
import { ToastProvider } from '@components/shared/toast'

const ContentContainer = styled(Box)`
  display: flex;
  width: 100%;
`

const LoupeApp = () => {
  const contentRef = React.useRef<HTMLDivElement>(null)
  const isAdminMode = useStoreState(store => store.app.isAdminMode)
  const project = useStoreState(store => store.project.current)

  return (
    <ToastProvider portalToRef={contentRef}>
      <Flex height='100vh' direction='column'>
        <ElectronHeader />
        <SystemPanel />
        <Flex>
          <Flex direction='column'>
            <ProjectPanelSwitch />
            <Flex>
              <PerspectivePanelSwitch />
              <ContentContainer refNode={contentRef}>
                <ContentPanelSwitch />
              </ContentContainer>
            </Flex>
            <ActionPanelSwitch />
            <Snackbar type='neutral' expanded={isAdminMode && !!project}>
              Viewing assets in admin mode.
            </Snackbar>
          </Flex>
          <RightPanelSwitch />
        </Flex>
      </Flex>
    </ToastProvider>
  )
}

const ProtectedRoute = ({ component: Component, ...rest }: any) => {
  const isLoggedIn = useStoreState(store => store.app.isLoggedIn)
  return (
    <Route
      {...rest}
      render={props => {
        return isLoggedIn ? <Component {...props} /> : <Redirect to='/login' />
      }}
    />
  )
}

const Login = () => <LoginPage />

export const App = () => {
  //   useStoreActions(a => a.app.fetchDbWindowId)() // Get the db window id so we can talk to it.
  const isLoggedIn = useStoreState(store => store.app.isLoggedIn)
  return (
    <>
      {isLoggedIn ? (
        <ProtectedRoute path='/' component={LoupeApp} />
      ) : (
        <Redirect to='/login' />
      )}
      <Route exact path='/login' component={Login} />
    </>
  )
}
