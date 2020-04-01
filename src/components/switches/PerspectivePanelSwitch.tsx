import * as React from 'react'
import { Switch, Route } from 'react-router-dom'
import { PerspectivePanel } from '../perspectivePanel'

export const PerspectivePanelSwitch = () => {
  return (
    <Switch>
      <Route
        path='/project/:projectID/brief'
        exact
        render={() => <PerspectivePanel />}
      />
      <Route
        path='/project/:projectID/tree'
        exact
        render={() => <PerspectivePanel />}
      />
      <Route
        path='/project/:projectID/workflow'
        exact
        render={() => <PerspectivePanel />}
      />
      <Route
        path='/project/:projectID/assets'
        exact
        render={() => <PerspectivePanel />}
      />
    </Switch>
  )
}
