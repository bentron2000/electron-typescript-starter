import * as React from 'react'
import { Switch, Route } from 'react-router-dom'
import { BriefContent } from '../perspectives/brief'
import { TreeContent } from '../perspectives/tree'
import { WorkflowContent } from '../perspectives/workflow'
import { DashboardContent } from '../dashboard'
import { MatchingContent } from '../matching'
import { AssetContent } from '../single_asset'
import { AssetsContent } from '../perspectives/assets'
import { DeepLinkProvider } from '../shared/deepLink/DeepLinkProvider'

export const ContentPanelSwitch = () => {
  const briefContentRef = React.useRef<HTMLDivElement>(null)
  return (
    <Switch>
      <Route
        path='/project/:projectID/brief'
        exact
        render={routeProps => (
          <DeepLinkProvider
            containerRef={briefContentRef}
            {...routeProps.location.state}
          >
            <BriefContent ref={briefContentRef} />
          </DeepLinkProvider>
        )}
      />
      <Route
        path='/project/:projectID/tree'
        exact
        render={() => <TreeContent />}
      />
      <Route
        path='/project/:projectID/workflow'
        exact
        render={() => <WorkflowContent />}
      />
      <Route
        path='/project/:projectID/assets'
        exact
        render={() => <AssetsContent />}
      />
      {/* For accessing toaster in views below, implement as per above */}
      <Route
        path='/project/:projectID/matching'
        exact
        render={() => <MatchingContent />}
      />
      <Route
        path='/project/:projectID/single-asset'
        exact
        render={() => <AssetContent />}
      />
      <Route render={() => <DashboardContent />} />
    </Switch>
  )
}
