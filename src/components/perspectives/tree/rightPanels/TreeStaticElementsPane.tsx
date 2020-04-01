import * as React from 'react'
import styled from 'styled-components'
import { all, any } from 'ramda'

import { useStateLockedByPromise } from '@components/helpers'
import { LoupeRealmResponse, LoupeRealmErrorResponse } from '@models/ipc'
import { Section, Element, TreeInstance, TreeDefinition, Stage } from '@models'
import { numStaticElements } from '@models/Section'
import { tIgetName } from '@models/TreeInstance'
import { tDfindById } from '@models/TreeDefinition'
import { createTiRelevance, relators, hasTiRelevance } from '@models/Element'
import { ElementRelevance } from '@redux/state'

import { useToasts } from '../../../shared/toast/ToastProvider'
import { theme } from '../../../shared/Theme/theme'
import {
  Text,
  Input,
  Heading,
  Flex,
  Box,
  Icon,
  StageLabel,
  Subsection,
  BoxCheckbox,
  CheckboxList,
  CheckboxListChildProps,
} from '../../../shared'

const ElementInheritanceLabel = styled.a`
  text-decoration: underline;
  color: #4d5461;
`

export interface TreeElementsPane {
  rootTD: TreeDefinition
  rootTI: TreeInstance
  selectedTD: TreeDefinition | undefined
  selectedTI: TreeInstance
  selectTD: (td: TreeDefinition) => void
  selectTI: (ti: TreeInstance) => void
  sections: Section[]
  sectionStages: (section: Section) => Stage[]
  updateRelevance: (relevance: ElementRelevance) => Promise<LoupeRealmResponse>
}

type TreeElementsDrilled = Pick<
  TreeElementsPane,
  'sectionStages' | 'rootTI' | 'updateRelevance' | 'selectedTI'
>
interface SectionItem extends TreeElementsDrilled {
  first: boolean
  section: Section
  search: string
  onInheritedLabelClick: (relator: TreeInstance) => void
}

type SectionItemDrilled = Omit<
  SectionItem,
  'section' | 'sectionStages' | 'search'
>
interface ElementItem extends CheckboxListChildProps, SectionItemDrilled {
  element: Element
}

const isAttributedViaInheritance = (
  elemRelator: TreeInstance,
  rootTI: TreeInstance
) => Boolean(elemRelator) && elemRelator.id !== rootTI.id

const isElementAttributed = (
  element: Element,
  ti: TreeInstance,
  rootTI: TreeInstance
) => {
  const elementRelator = relators(element, rootTI, ti)[0]
  return !!(
    hasTiRelevance(element, ti.id) ||
    (isAttributedViaInheritance(elementRelator, rootTI) && elementRelator)
  )
}

const ElementItem = ({
  element,
  rootTI,
  selectedTI,
  updateRelevance,
  onInheritedLabelClick,
  ...props
}: ElementItem) => {
  const { addToast } = useToasts()
  const elementRelator = relators(element, rootTI, selectedTI)[0]
  const [checked, locked, setChecked] = useStateLockedByPromise(
    isElementAttributed(element, selectedTI, rootTI)
  )
  const handleInheritedLabelClick = (e: React.MouseEvent) => {
    e.stopPropagation() // prevent check
    onInheritedLabelClick(elementRelator)
  }
  const handleChecked = () => {
    if (locked) {
      return
    }

    const newChecked = !checked
    const promise = updateRelevance({
      element,
      treeInstanceRelevanceIds: createTiRelevance(element, selectedTI.id),
    })
    setChecked(newChecked, promise)
    promise.catch((err: LoupeRealmErrorResponse) => {
      setChecked(!newChecked)
      addToast(err.message, { type: 'negative' })
    })
  }

  React.useEffect(
    () => setChecked(isElementAttributed(element, selectedTI, rootTI)),
    [element, selectedTI, props.allChecked]
  )

  return (
    <BoxCheckbox
      checked={checked}
      locked={isAttributedViaInheritance(elementRelator, rootTI)}
      onChange={handleChecked}
      {...props}
    >
      <span>{element.name} </span>
      {isAttributedViaInheritance(elementRelator, rootTI) && (
        <ElementInheritanceLabel onClick={handleInheritedLabelClick}>
          via {tIgetName(elementRelator)}
        </ElementInheritanceLabel>
      )}
    </BoxCheckbox>
  )
}

const SectionItem = ({
  section,
  search = '',
  sectionStages,
  ...props
}: SectionItem) => {
  const { addToast } = useToasts()
  const getStaticEls = () =>
    section.elements.filter((element: Element) => !element.isFieldSet)
  const [staticElements, setStaticElements] = React.useState(getStaticEls())

  // Search bar filter state
  const [filteredElements, setFilteredElements] = React.useState(staticElements)

  const isAllChecked = () =>
    all(
      element => isElementAttributed(element, props.selectedTI, props.rootTI),
      filteredElements
    )
  const isAllInherited = () =>
    all(
      element =>
        isAttributedViaInheritance(
          relators(element, props.rootTI, props.selectedTI)[0],
          props.rootTI
        ),
      filteredElements
    )
  const isSomeChecked = () =>
    any(
      element => isElementAttributed(element, props.selectedTI, props.rootTI),
      filteredElements
    )
  const isSomeInherited = () =>
    any(
      element =>
        isAttributedViaInheritance(
          relators(element, props.rootTI, props.selectedTI)[0],
          props.rootTI
        ),
      filteredElements
    )

  const [allChecked, setAllChecked] = React.useState(isAllChecked())

  const handleOnAllChecked = (newAllChecked: boolean) => {
    const promises = filteredElements.map(element =>
      props.updateRelevance({
        element,
        treeInstanceRelevanceIds: createTiRelevance(
          element,
          props.selectedTI.id,
          newAllChecked
        ),
      })
    )
    Promise.all(promises).catch((err: LoupeRealmErrorResponse) =>
      addToast(err.message, { type: 'negative' })
    )
  }

  React.useEffect(() => {
    const elements = search
      ? staticElements.filter(e => e.name.toLowerCase().includes(search))
      : staticElements
    setFilteredElements(elements)
    setAllChecked(isAllChecked())
  }, [staticElements, search])

  React.useEffect(() => setStaticElements(getStaticEls()), [section.elements])

  return (
    <Subsection
      minimal
      expanded
      heading={
        <Box width='100%' p='4px 0 4px 12px'>
          <Heading mb='0px' size='small'>
            {section.name}
          </Heading>
        </Box>
      }
    >
      <Flex width='100%'>
        <Box p='0 16px' width='100%'>
          <Flex align='center'>
            <Box height='24px' mr={theme.s2}>
              <Icon name='eye' width='24px' fill={theme.grayLighter} />
            </Box>
            <StageLabel section={section} stages={sectionStages(section)} />
          </Flex>
          <Box p='16px 0' width='100%'>
            <CheckboxList
              allChecked={allChecked}
              hideBoxCheck={isAllInherited()}
              reverseAllChecked={isSomeInherited()}
              someChecked={isSomeChecked()}
              onAllChecked={handleOnAllChecked}
            >
              {filteredElements.map(element => (
                <ElementItem key={element.id} element={element} {...props} />
              ))}
            </CheckboxList>
          </Box>
        </Box>
      </Flex>
    </Subsection>
  )
}

export const TreeElementsPane = ({
  sections,
  selectedTD,
  selectTD,
  selectTI,
  rootTD,
  ...props
}: TreeElementsPane) => {
  const getStaticSections = () => sections.filter(s => numStaticElements(s) > 0)
  const [staticSections, setStaticSections] = React.useState(
    getStaticSections()
  )
  // Search bar state
  const [search, setSearch] = React.useState('')
  // Search filtered state
  const [filteredSections, setFilteredSections] = React.useState(staticSections)

  const handleElementInheritedLabelSelection = (relator: TreeInstance) => {
    // Flat tree instances view is shown when a selectedTD is present
    if (selectedTD) {
      const def = tDfindById(rootTD, relator.definitionId)[0]
      selectTD(def)
    }
    selectTI(relator)
  }

  React.useEffect(() => {
    // Sections are filtered out if no elements match the search
    const sect = search
      ? staticSections.filter(s =>
          s.elements.some(e => e.name.toLowerCase().includes(search))
        )
      : staticSections
    setFilteredSections(sect)
  }, [staticSections, search])

  React.useEffect(() => setStaticSections(getStaticSections()), [sections])

  return (
    <Box display='block'>
      <Flex direction='column'>
        <Flex direction='column' p='16px 16px 0 16px'>
          <Input
            flex
            label='search'
            icon='search'
            width='100%'
            onChange={value => setSearch(value.toLowerCase())}
            onChangeDebounceDuration={300}
            mb={theme.s2}
            placeholder={`Search elements...`}
          />
        </Flex>
        {filteredSections.length ? (
          filteredSections.map((section, index) => (
            <SectionItem
              key={`${props.selectedTI.id}${section.id}`}
              first={index === 0}
              section={section}
              search={search}
              onInheritedLabelClick={handleElementInheritedLabelSelection}
              {...props}
            />
          ))
        ) : (
          <Box p='16px'>
            <Text small color='white'>
              No elements found
            </Text>
          </Box>
        )}
      </Flex>
    </Box>
  )
}
