import * as React from 'react'
import { useHistory } from 'react-router'
import { intersection } from 'ramda'

import { useStoreState, useStoreActions } from '@redux/store'
import { AccordionItem } from '@components/shared/accordion/Accordion'
import { TreeViewPane } from '@components/shared/rightPanels/TreeViewPane'

import { BriefInfoPane, CommentsPane, ActivityPane, RepositoriesPane } from '.'
import { tIfindById } from '@models/TreeInstance'

export interface AssetsRightPanelProvider {
  children: (props: any) => React.ReactNode
}

export const AssetsRightPanelProvider = (props: AssetsRightPanelProvider) => {
  const rootTI = useStoreState(s => s.project.tree.rootTI)
  const stages = useStoreState(s => s.project.stages.all)
  const setAssetFilter = useStoreActions(a => a.assetPerspective.filter.set)
  const currentAssetFilter = useStoreState(
    s => s.assetPerspective.filter.current
  )
  const setActivePerspective = useStoreActions(a => a.app.setCurrentPerspective)
  const project = useStoreState(s => s.project.current)
  const brief = useStoreState(s => s.assetPerspective.brief.filteredBrief)
  const briefFilters = useStoreState(s => s.assetPerspective.brief.filters)
  const setBriefPerspFilters = useStoreActions(
    a => a.briefPerspective.filter.set
  )
  const rhpState = useStoreState(s => s.assetPerspective.rhp)
  const setTreeRhpState = useStoreActions(a => a.assetPerspective.rhp.setTree)
  const setBriefInfoRhpState = useStoreActions(
    a => a.assetPerspective.rhp.setBriefInfo
  )
  const tree = useStoreState(s => s.assetPerspective.tree.tree)

  const routeHistory = useHistory()

  // Filter out brief elements with no data
  const briefInfoElements = brief.flatMap(section =>
    section.elements.filter(el => el.data.length)
  )

  const briefFilteredTi = () =>
    briefFilters.treeFilter.length && rootTI
      ? tIfindById(rootTI, briefFilters.treeFilter[0])[0]
      : undefined

  const briefFilteredStage = () =>
    briefFilters.stageFilter.length
      ? stages.find(s => s.id === briefFilters.stageFilter[0])
      : undefined

  const handleTreeSelect = (tiId: string) =>
    currentAssetFilter.treeFilter.includes(tiId)
      ? setAssetFilter({ ...currentAssetFilter, treeFilter: [] })
      : setAssetFilter({ ...currentAssetFilter, treeFilter: [tiId] })

  const handleOpenInBrief = (state?: { linkToIds?: string[] }) => {
    if (project) {
      setBriefPerspFilters({
        ...briefFilters,
        sectionFilter: brief
          .filter(
            s =>
              intersection(
                s.elements.map(e => e.id),
                briefInfoElements.map(e => e.id)
              ).length > 0
          )
          .map(s => s.id),
      })
      routeHistory.push(`/project/${project.id}/brief`, state)
      setActivePerspective('brief')
    }
  }

  const items: AccordionItem[] = [
    {
      title: 'Loupe Tree',
      content: (
        <TreeViewPane
          tree={tree}
          handleClick={handleTreeSelect}
          currentSelection={currentAssetFilter.treeFilter}
        />
      ),
      expand: rhpState.tree.expand,
      onExpand: expand => setTreeRhpState({ expand, locked: true }),
    },
    {
      title: 'Brief Information',
      content: (
        <BriefInfoPane
          elements={briefInfoElements}
          onOpenInBrief={handleOpenInBrief}
          filteredTree={briefFilteredTi()}
          filteredStage={briefFilteredStage()}
        />
      ),
      expand: rhpState.briefInfo.expand,
      onExpand: expand => setBriefInfoRhpState({ expand, locked: true }),
    },
    { title: 'Comments', content: <CommentsPane /> },
    { title: 'Activity', content: <ActivityPane /> },
    { title: 'Tools', content: '' },
    { title: 'Repositories', content: <RepositoriesPane /> },
  ]

  return <>{props.children({ items, ...props })}</>
}
