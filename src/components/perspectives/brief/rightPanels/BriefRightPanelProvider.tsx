import * as React from 'react'
import { useStoreState, useStoreActions } from '@redux/store'

import { Section } from '@models/Section'
import { Element } from '@models/Element'
import { TreeDefinition } from '@models/TreeDefinition'
import { TreeInstance } from '@models/TreeInstance'

import {
  SectionFilterPane,
  StageFilterPane,
  BriefStagesPane,
  BriefRelevancePane,
} from '.'

import { AccordionItem } from '@components/shared/accordion/Accordion'
import { TreeViewPane } from '@components/shared/rightPanels/TreeViewPane'

interface RightPanelMenuItem extends AccordionItem {
  hidden?: boolean
}

export interface BriefRightPanelProvider {
  children: (props: any) => React.ReactNode
}

export const BriefRightPanelProvider = (props: any) => {
  const rootTD = useStoreState(state => state.project.tree.rootTD)
  const rootTI = useStoreState(state => state.project.tree.rootTI)
  const getTI = useStoreState(state => state.project.tree.getTI)
  const stages = useStoreState(state => state.project.stages.all)
  const sections = useStoreState(
    state => state.briefPerspective.filteredByStage
  )
  const sectionStages = useStoreState(
    state => state.project.briefs.sectionStages
  )
  const selectedSection = useStoreState(
    state => state.briefPerspective.section.current
  )
  const updateSection = useStoreActions(
    actions => actions.briefPerspective.section.update
  )
  const selectedElement = useStoreState(
    state => state.briefPerspective.element.current
  )
  const updateRelevance = useStoreActions(
    actions => actions.briefPerspective.element.updateRelevance
  )
  const rhpState = useStoreState(s => s.briefPerspective.rhp)
  const setStageRelRhpState = useStoreActions(
    a => a.briefPerspective.rhp.setStageRelevance
  )
  const setElementRelRhpState = useStoreActions(
    a => a.briefPerspective.rhp.setElementRelevance
  )
  const setStagesRhpState = useStoreActions(
    a => a.briefPerspective.rhp.setStages
  )
  const setTreeRhpState = useStoreActions(a => a.briefPerspective.rhp.setTree)
  const setSectionsRhpState = useStoreActions(
    a => a.briefPerspective.rhp.setSections
  )
  const tree = useStoreState(s => s.briefPerspective.tree.tree)

  // Filtering
  const briefFilter = useStoreState(
    state => state.briefPerspective.filter.current
  )
  const setBriefFilter = useStoreActions(
    actions => actions.briefPerspective.filter.set
  )

  const handleTreePanelItemClick = (id: string) => {
    setBriefFilter({
      ...briefFilter,
      treeFilter: briefFilter.treeFilter.includes(id) ? [] : [id], // single selection version.

      // THIS VERSION FOR MULTI SELECT...
      // treeFilter: briefFilter.treeFilter.includes(id)
      //   ? briefFilter.treeFilter.filter(t => t !== id)
      //   : [...briefFilter.treeFilter, id]
    })
  }

  const sectionStagesCount = selectedSection
    ? sectionStages(selectedSection).length
    : 0

  let items: RightPanelMenuItem[] = [
    {
      title: `${
        selectedElement && selectedElement.isFieldSet
          ? 'Fieldset relates to'
          : 'Element relates to'
      }`,
      content: (
        <BriefRelevancePane
          // TODO: should we assert rootTD's presence with typescript globally?
          rootTd={rootTD as TreeDefinition}
          rootTi={rootTI as TreeInstance}
          getTi={getTI}
          element={selectedElement as Element}
          updateRelevance={updateRelevance}
        />
      ),
      expand: rhpState.elementRelevance.expand,
      onExpand: expand => setElementRelRhpState({ expand, locked: true }),
      hidden: !selectedElement,
    },
    {
      title: 'Loupe Tree',
      content: (
        <TreeViewPane
          tree={tree}
          currentSelection={briefFilter.treeFilter}
          handleClick={handleTreePanelItemClick}
        />
      ),
      expand: rhpState.tree.expand,
      onExpand: expand => setTreeRhpState({ expand, locked: true }),
    },
    {
      title: 'Stages',
      content: (
        <StageFilterPane
          stages={stages}
          filter={briefFilter}
          setFilter={setBriefFilter}
        />
      ),
      expand: rhpState.stages.expand,
      onExpand: expand => setStagesRhpState({ expand, locked: true }),
    },
    {
      title: 'Sections',
      content: (
        <SectionFilterPane
          sections={sections}
          filter={briefFilter}
          setFilter={setBriefFilter}
        />
      ),
      expand: rhpState.sections.expand,
      onExpand: expand => setSectionsRhpState({ expand, locked: true }),
    },
    {
      id: 'workflow-stages',
      title: `Visible on ${sectionStagesCount} Stages`,
      content: (
        <BriefStagesPane
          stages={stages}
          section={selectedSection as Section}
          sectionStages={sectionStages}
          updateSection={updateSection}
        />
      ),
      expand: rhpState.stageRelevance.expand,
      onExpand: expand => setStageRelRhpState({ expand, locked: true }),
      hidden: !selectedSection,
    },
  ]

  // Filtering directly on the above constant breaks the types because
  // .filter() has annoying typing.
  items = items.filter(i => !i.hidden)

  return <>{props.children({ items, ...props })}</>
}
