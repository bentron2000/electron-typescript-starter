import * as React from 'react'
import { AccordionItem } from '../../shared/accordion/Accordion'
import { DashboardActivityPane } from '.'

export interface DashboardRightPanelProvider {
  children: (props: any) => React.ReactNode
}

export const DashboardRightPanelProvider = (
  props: DashboardRightPanelProvider
) => {
  const items: AccordionItem[] = [
    {
      title: 'Activity',
      content: <DashboardActivityPane />
    }
  ]

  return <>{props.children({ items, ...props })}</>
}
