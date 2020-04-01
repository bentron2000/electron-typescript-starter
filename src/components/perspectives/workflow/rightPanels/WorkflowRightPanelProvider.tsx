import * as React from 'react'
import { useStoreState, useStoreActions } from '@redux/store'
import { Stage, StageTransition } from '@models'

import {
  WorkflowRoutingPane,
  WorkflowToolsPane,
  WorkflowGroupsPane,
  WorkflowSectionsPane,
  WorkflowRepositoriesPane
} from '.'
import { AccordionItem } from '../../../shared/accordion/Accordion'

type RightPanelMenuItem = AccordionItem & { hidden?: boolean }

export interface WorkflowRightPanelProvider {
  children: (props: any) => React.ReactNode
}

export const WorkflowRightPanelProvider = (
  props: WorkflowRightPanelProvider
) => {
  const sections = useStoreState(store => store.project.briefs.all)
  const currentStage = useStoreState(
    state => state.workflowPerspective.stage.current
  )
  const stageSections = useStoreState(
    store => store.project.stages.stageSections
  )
  const updateStage = useStoreActions(
    actions => actions.workflowPerspective.stage.update
  )
  const stageSectionsCount = currentStage
    ? stageSections(currentStage.id).length
    : 0
  const stages = useStoreState(state => state.project.stages.all)
  const updateTransition = useStoreActions(
    a => a.workflowPerspective.transition.update
  )

  const saveTransitionName = (node: StageTransition, newName: string) => {
    return updateTransition({ ...node, name: newName })
  }

  const items: RightPanelMenuItem[] = [
    {
      title: 'Routing',
      id: 'routing',
      content: (
        <WorkflowRoutingPane
          stage={currentStage as Stage}
          stages={stages}
          saveTransitionName={saveTransitionName}
        />
      ),
      hidden: !currentStage
    },
    { title: 'Tools', content: <WorkflowToolsPane /> },
    { title: 'Groups', content: <WorkflowGroupsPane /> },
    {
      title: 'Repositories',
      content: <WorkflowRepositoriesPane currentStage={currentStage} />
    },
    {
      id: 'brief-sections',
      title: `${stageSectionsCount} Brief Sections`,
      content: (
        <WorkflowSectionsPane
          sections={sections}
          stage={currentStage as Stage}
          stageSections={stageSections}
          updateStage={updateStage}
        />
      ),
      hidden: !currentStage
    }
  ].filter(i => !i.hidden)

  return <>{props.children({ items, ...props })}</>
}
