import * as React from 'react'
import { Switch, Route } from 'react-router-dom'
import { BriefProjectPanelContent } from '../perspectives/brief/projectPanel'
import { TreeProjectPanelContent } from '../perspectives/tree/projectPanel'
import { WorkflowProjectPanelContent } from '../perspectives/workflow/projectPanel'
import { AssetsProjectPanelContent } from '../perspectives/assets/projectPanel'
import { DashboardProjectPanelContent } from '../dashboard/projectPanel'
import { MatchingProjectPanelContent } from '../matching/projectPanel'
import { AssetProjectPanelContent } from '../single_asset/projectPanel'

export const ProjectPanelSwitch = () => {
  return (
    <Switch>
      <Route
        path='/project/:projectID/brief'
        exact
        render={() => <BriefProjectPanelContent />}
      />
      <Route
        path='/project/:projectID/tree'
        exact
        render={() => <TreeProjectPanelContent />}
      />
      <Route
        path='/project/:projectID/workflow'
        exact
        render={() => <WorkflowProjectPanelContent />}
      />
      <Route
        path='/project/:projectID/assets'
        exact
        render={() => <AssetsProjectPanelContent />}
      />
      <Route
        path='/project/:projectID/matching'
        exact
        render={match => <MatchingProjectPanelContent match={match} />}
      />
      <Route
        path='/project/:projectID/single-asset'
        exact
        render={match => <AssetProjectPanelContent match={match} />}
      />
      <Route path='/' render={() => <DashboardProjectPanelContent />} />
    </Switch>
  )
}
