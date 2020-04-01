import * as React from 'react'
import { Switch, Route } from 'react-router-dom'
import { BriefActionPanelContent } from '../perspectives/brief/actionPanel'
import { TreeActionPanelContent } from '../perspectives/tree/actionPanel'
import { WorkflowActionPanelContent } from '../perspectives/workflow/actionPanel'
import { AssetsActionPanelContent } from '../perspectives/assets/actionPanel'
import { MatchingActionPanelContent } from '../matching/actionPanel'

export const ActionPanelSwitch = () => {
  return (
    <Switch>
      <Route
        path='/project/:projectID/brief'
        exact
        render={() => <BriefActionPanelContent />}
      />
      <Route
        path='/project/:projectID/tree'
        exact
        render={() => <TreeActionPanelContent />}
      />
      <Route
        path='/project/:projectID/workflow'
        exact
        render={() => <WorkflowActionPanelContent />}
      />
      <Route
        path='/project/:projectID/assets'
        exact
        render={() => <AssetsActionPanelContent />}
      />
      <Route
        path='/project/:projectID/matching'
        exact
        render={match => <MatchingActionPanelContent match={match} />}
      />
    </Switch>
  )
}
