import * as React from 'react'
import { MetadataPane, CommentsPane, HistoryPane, SettingsPane } from '.'
import { AccordionItem } from '../../shared/accordion/Accordion'
import { useStoreState } from '@redux/store'

export interface AssetRightPanelProvider {
  children: (props: any) => React.ReactNode
}

export const AssetRightPanelProvider = (props: AssetRightPanelProvider) => {
  const currentMediaState = useStoreState(
    state => state.assetPerspective.mediaState.current
  )
  const items: AccordionItem[] = [
    {
      title: 'Metadata',
      content: <MetadataPane currentMediaState={currentMediaState} />
    },
    { title: 'Comments', content: <CommentsPane /> },
    { title: 'History', content: <HistoryPane /> },
    { title: 'Settings', content: <SettingsPane /> }
  ]

  return <>{props.children({ items, currentMediaState, ...props })}</>
}
