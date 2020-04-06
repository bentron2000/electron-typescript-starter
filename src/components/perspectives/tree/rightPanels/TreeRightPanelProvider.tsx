import * as React from 'react'
import { any } from 'ramda'
import { useHistory } from 'react-router'

import { useStoreState, useStoreActions } from '@redux/store'

import { Project } from '@models/Project'
import { nestedRelators } from '@models/Element'
import { numStaticElements } from '@models/Section'
import { TreeDefinition } from '@models/TreeDefinition'
import { TreeInstance } from '@models/TreeInstance'

import { AccordionItem } from '@components/shared/accordion/Accordion'

import {
  TreeFieldsetPane,
  TreeFileFormatPane,
  TreeSettingsPane,
  TreeElementsPane,
} from '.'

type RightPanelMenuItem = AccordionItem & { hidden?: boolean }

export interface TreeRightPanelProvider {
  children: (props: any) => React.ReactNode
}

export const TreeRightPanelProvider = (props: TreeRightPanelProvider) => {
  const history = useHistory()
  const project = useStoreState(store => store.project.current)
  const sections = useStoreState(store => store.project.briefs.all)
  const rootTI = useStoreState(store => store.project.tree.rootTI)
  const rootTD = useStoreState(store => store.project.tree.rootTD)
  const currentTD = useStoreState(store => store.treePerspective.td.current)
  const currentTI = useStoreState(store => store.treePerspective.ti.current)
  const selectTI = useStoreActions(actions => actions.treePerspective.ti.set)
  const selectTD = useStoreActions(actions => actions.treePerspective.td.set)
  const updateTD = useStoreActions(store => store.treePerspective.td.update)
  // const stages = useStoreState(store => store.project.stages.all)
  const sectionStages = useStoreState(s => s.project.briefs.sectionStages)
  const updateRelevance = useStoreActions(
    actions => actions.briefPerspective.element.updateRelevance
  )
  const setActivePerspective = useStoreActions(a => a.app.setCurrentPerspective)
  const rhpState = useStoreState(s => s.treePerspective.rhp)
  const setSettingsRhpState = useStoreActions(
    a => a.treePerspective.rhp.setSettings
  )
  const setFilesRhpState = useStoreActions(a => a.treePerspective.rhp.setFiles)
  const setStaticElsRhpState = useStoreActions(
    a => a.treePerspective.rhp.setStaticElements
  )
  const setFieldsetElsRhpState = useStoreActions(
    a => a.treePerspective.rhp.setFieldsetElements
  )

  const getFieldsetElements = () =>
    sections.flatMap(s => {
      return s.elements.filter(e => {
        return Boolean(
          currentTD
            ? e.isFieldSet && e.treeDefinitionRelevanceId === currentTD.id
            : e.isFieldSet &&
                rootTD &&
                currentTI &&
                any(
                  ti => ti.id === currentTI.id,
                  nestedRelators(e, rootTD, currentTI)
                )
        )
      })
    })
  const [fieldsetElements, setFieldsetElements] = React.useState(
    getFieldsetElements()
  )

  const staticElementsCount = sections.reduce(
    (acc, sec) => acc + numStaticElements(sec),
    0
  )

  const handleSetBriefPerspective = () => {
    if (project) {
      history.push(`project/${project.id}/brief`)
      setActivePerspective('brief')
    }
  }

  React.useEffect(() => setFieldsetElements(getFieldsetElements()), [
    sections,
    currentTD,
    currentTI,
  ])

  // NOTE: Make sure items added here have a unique id
  let items: RightPanelMenuItem[] = [
    {
      title: 'File Formats',
      content: (
        <TreeFileFormatPane
          currentTD={currentTD as TreeDefinition}
          updateTD={updateTD}
        />
      ),
      expand: rhpState.files.expand,
      onExpand: expand => setFilesRhpState({ expand, locked: true }),
      hidden: !currentTD || !currentTD.mediaAllowed,
    },
    {
      title: 'Settings',
      content: (
        <TreeSettingsPane
          currentTD={currentTD as TreeDefinition}
          updateTD={updateTD}
        />
      ),
      expand: rhpState.settings.expand,
      onExpand: expand => setSettingsRhpState({ expand, locked: true }),
      hidden: !currentTD,
    },
    {
      title: `${staticElementsCount} Brief Elements`,
      content: (
        <TreeElementsPane
          sections={sections}
          selectedTI={currentTI as TreeInstance}
          selectedTD={currentTD}
          selectTI={selectTI}
          selectTD={selectTD}
          sectionStages={sectionStages}
          updateRelevance={updateRelevance}
          rootTI={rootTI as TreeInstance}
          rootTD={rootTD as TreeDefinition}
        />
      ),
      expand: rhpState.staticElements.expand,
      onExpand: expand => setStaticElsRhpState({ expand, locked: true }),
      hidden: !currentTI || !rootTI || !rootTD,
    },
    {
      title: `${fieldsetElements.length} Fieldset Elements`,
      content: (
        <TreeFieldsetPane
          project={project as Project}
          elements={fieldsetElements}
          rootTD={rootTD as TreeDefinition}
          selectedTI={currentTI as TreeInstance}
          setBriefPerspective={handleSetBriefPerspective}
        />
      ),
      expand: rhpState.fieldsetElements.expand,
      onExpand: expand => setFieldsetElsRhpState({ expand, locked: true }),
      hidden:
        !rootTD ||
        !project ||
        // No fieldset elements or fieldset elements related to selected TD
        !fieldsetElements.length ||
        // No TD or TI selection has been made
        (!currentTD && !currentTI) ||
        // No EDs for the related to the selected TI
        (currentTI && !currentTI.elementData.length),
    },
  ]

  // Filtering directly on the above constant breaks the types because
  // .filter() has annoying typing.
  items = items.filter(i => !i.hidden)

  return <>{props.children({ items, ...props })}</>
}
