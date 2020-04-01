import * as React from 'react'
import pluralize from 'pluralize'
import { groupBy, any } from 'ramda'

import { LoupeRealmResponse, LoupeRealmErrorResponse } from '@models/ipc'
import { tDflatMap, tDfindById, tDgetBranch } from '@models/TreeDefinition'
import { hasTiRelevance, createTiRelevance } from '@models/Element'
import {
  Element,
  TreeInstance,
  TreeDefinition,
  ElementRelevance,
} from '@models'

import { theme } from '@components/shared/Theme/theme'
import { useToasts } from '@components/shared/toast/ToastProvider'
import {
  Box,
  Input,
  Text,
  Flex,
  Select,
  CheckboxList,
  CheckboxListChildProps,
  BoxCheckbox,
  Subsection,
  TreeAncestorBreadcrumb,
} from '@components/shared'
import {
  useStateLockedByPromise,
  setStateFn,
} from '@components/helpers/useStateLockedByPromise'
import { tIgetName, tIgetBranch } from '@models/TreeInstance'

export interface BriefRelevancePane {
  element: Element
  rootTd: TreeDefinition
  rootTi: TreeInstance
  getTi: (id: string) => TreeInstance | undefined
  updateRelevance: (relevance: ElementRelevance) => Promise<LoupeRealmResponse>
}

interface SectionItem
  extends CheckboxListChildProps,
    Pick<BriefRelevancePane, 'element' | 'updateRelevance'> {
  heading: React.ReactNode
  tis: TreeInstance[]
  displayFlat?: boolean
}

interface InstanceItem
  extends CheckboxListChildProps,
    Pick<BriefRelevancePane, 'element' | 'updateRelevance'> {
  ti: TreeInstance
}

const InstanceItem = ({
  ti,
  element,
  allChecked,
  updateRelevance,
}: InstanceItem) => {
  const { addToast } = useToasts()
  const isChecked = () => hasTiRelevance(element, ti.id)
  const [checked, locked, setChecked] = useStateLockedByPromise(isChecked())
  const handleChecked = () => {
    if (locked) {
      return
    }

    const newChecked = !checked
    const promise = updateRelevance({
      element,
      treeInstanceRelevanceIds: createTiRelevance(element, ti.id),
    })
    setChecked(newChecked, promise)
    promise.catch((err: LoupeRealmErrorResponse) => {
      setChecked(!newChecked)
      addToast(err.message, { type: 'negative' })
    })
  }

  React.useEffect(() => setChecked(isChecked()), [ti, element, allChecked])

  return (
    <BoxCheckbox checked={checked} onChange={handleChecked}>
      {tIgetName(ti)}
    </BoxCheckbox>
  )
}

const SectionItem = ({ heading, displayFlat, ...props }: SectionItem) => {
  return displayFlat ? (
    <>
      {props.tis.map(ti => (
        <InstanceItem key={ti.id} ti={ti} {...props} />
      ))}
    </>
  ) : (
    <Subsection minimal expanded heading={heading}>
      {props.tis.map(ti => (
        <InstanceItem key={ti.id} ti={ti} {...props} />
      ))}
    </Subsection>
  )
}

export const BriefRelevancePane = ({
  rootTd,
  rootTi,
  element,
  getTi,
  updateRelevance,
}: BriefRelevancePane) => {
  const { addToast } = useToasts()
  const [tds, setTds] = React.useState(tDflatMap(rootTd, td => td, true))
  // The first rel ti id will always be a level 1 node of the binary tree (static)
  const getHeighestRelTiDefinition = () => {
    const heighestRelTi = getTi(
      element.treeInstanceRelevanceIds.find((id: string) => id !== rootTi.id) ||
        ''
    )
    return heighestRelTi
      ? tDfindById(rootTd, heighestRelTi.definitionId)[0]
      : tds[0]
  }
  // Selected TD relevance
  const getFieldsetTdRelevance = () =>
    tDfindById(rootTd, element.treeDefinitionRelevanceId)[0]

  // Selected nested TD relevance (fieldset)
  const getFieldsetNestedDefinition = () =>
    tDfindById(rootTd, element.nestedTreeDefinitionRelevanceId)[0]

  const getSelectedTd = () =>
    element.isFieldSet ? getFieldsetTdRelevance() : getHeighestRelTiDefinition()

  // The first select box for both static and fieldset elements
  const [selectedTd, selectTdLocked, setSelectedTd] = useStateLockedByPromise(
    getSelectedTd()
  ) as [TreeDefinition, boolean, setStateFn]

  // The second select box for fieldset elements
  const [
    selectedNestedTd,
    selectNestedTdLocked,
    setSelectedNestedTd,
  ] = useStateLockedByPromise(getFieldsetNestedDefinition()) as [
    TreeDefinition,
    boolean,
    setStateFn
  ]

  // No nested attributions can be made when fieldset and set to entire project
  const isFieldsetEntireProject =
    element.isFieldSet && selectedNestedTd.id === rootTd.id

  // Instances to render in checkboxes & attribute to element TI relevances
  const selectedTdByElementType = element.isFieldSet
    ? selectedNestedTd
    : selectedTd

  // Search bar filter state
  const [filteredInstances, setFilteredInstances] = React.useState(
    selectedTdByElementType.instances
  )
  const filteredInstanceIds = () => filteredInstances.map(i => i.id)

  // Select / deselect all state
  const [allChecked, checkLocked, setAllChecked] = useStateLockedByPromise(
    hasTiRelevance(element, filteredInstanceIds())
  )

  // TIs are grouped by parentTi, and rendered as checkboxes in breadcrumb collapsables
  const [groupedTis, setGroupedTis] = React.useState<{
    [key: string]: TreeInstance[]
  }>({})

  // Search bar state
  const [search, setSearch] = React.useState('')

  // Nested tds (fieldset drill down tds)
  const nestedTds = () => {
    const defs = tDgetBranch(rootTd, selectedTd)
    return defs.slice(0, defs.length - 1)
  }

  const handleDefinitionSelected = (nodeId: string) => {
    const td = tDfindById(rootTd, nodeId)[0]
    if (!td || selectTdLocked) {
      return
    }

    const relevance = { element } as ElementRelevance
    Object.assign(
      relevance,
      element.isFieldSet
        ? {
            treeDefinitionRelevanceId: td.id,
            // Default associated selected td to entire project (nestedTd and tiRels set to respective root relationships)
            nestedTreeDefinitionRelevanceId: rootTd.id,
            treeInstanceRelevanceIds: rootTd.instances.map(ti => ti.id),
          }
        : { treeInstanceRelevanceIds: td.instances.map(ti => ti.id) }
    )
    const promise = updateRelevance(relevance)
    setSelectedTd(td, promise)
    promise.catch((err: LoupeRealmErrorResponse) => {
      setSelectedTd(selectedTd)
      addToast(err.message, { type: 'negative' })
    })
  }

  const handleNestedTdSelected = (nodeId: string) => {
    const td = tDfindById(rootTd, nodeId)[0]
    if (!td || selectNestedTdLocked) {
      return
    }

    const relevance: ElementRelevance = {
      element,
      nestedTreeDefinitionRelevanceId: td.id,
      treeInstanceRelevanceIds: td.instances.map(ti => ti.id),
    }
    const promise = updateRelevance(relevance)
    setSelectedNestedTd(td, promise)
    promise.catch((err: LoupeRealmErrorResponse) => {
      setSelectedTd(selectedTd)
      addToast(err.message, { type: 'negative' })
    })
  }

  const handleAllChecked = (newAllChecked: boolean) => {
    if (checkLocked) {
      return
    }

    const promise = updateRelevance({
      element,
      treeInstanceRelevanceIds: createTiRelevance(
        element,
        filteredInstanceIds(),
        newAllChecked
      ),
    })
    setAllChecked(newAllChecked, promise)
    promise.catch((err: LoupeRealmErrorResponse) => {
      setAllChecked(!newAllChecked)
      addToast(err.message, { type: 'negative' })
    })
  }

  const relevancesCount = (td: TreeDefinition) => {
    const selectedCount = element.treeInstanceRelevanceIds.filter(
      id => id !== rootTi.id
    ).length
    const totalCount = selectedTdByElementType.instances.length
    if (td.id === selectedTdByElementType.id) {
      return !selectedCount
        ? 'No'
        : selectedCount === totalCount
        ? 'All'
        : String(selectedCount)
    } else {
      return 'All'
    }
  }

  React.useEffect(() => {
    const groupByParentId = groupBy((ti: TreeInstance) => ti.parentId as string)
    // Filter instances list by search term (across entire branch)
    const filteredData = selectedTdByElementType.instances.filter(ti => {
      return tIgetBranch(rootTi, ti).some(inst =>
        inst.name.toLowerCase().includes(search)
      )
    })
    setFilteredInstances(filteredData)

    // Group filtered data by parent id
    const data = groupByParentId(filteredData.filter(i => Boolean(i.parentId)))
    setGroupedTis(data)
    // Determine whether all instances are selected
    setAllChecked(hasTiRelevance(element, filteredInstanceIds()))
  }, [selectedTd, selectedNestedTd, search])

  React.useEffect(() => {
    setSearch('')
    setSelectedTd(getSelectedTd())
    setSelectedNestedTd(getFieldsetNestedDefinition())
    setAllChecked(hasTiRelevance(element, filteredInstanceIds()))
  }, [element.id])

  React.useEffect(() => {
    setSelectedNestedTd(getFieldsetNestedDefinition())
    setAllChecked(hasTiRelevance(element, filteredInstanceIds()))
  }, [element.treeInstanceRelevanceIds])

  React.useEffect(() => setTds(tDflatMap(rootTd, td => td, true)), [rootTd])

  return (
    <Box width='100%' height='auto'>
      <Flex direction='column' height='100%'>
        <Box>
          <Flex>
            <Box p={theme.s3} width='100%' bb={theme.darkStroke} bg='#242933'>
              <Flex align='center' direction='column'>
                <Select
                  label='definitionSelector'
                  icon='tree'
                  mb={theme.s2}
                  w='100%'
                  handleChange={handleDefinitionSelected}
                >
                  {tds.map(node => {
                    const count = relevancesCount(node)
                    return (
                      <option
                        key={node.id}
                        value={node.id}
                        selected={node.id === selectedTd.id}
                      >
                        {`${element.isFieldSet ? 'All ' : count} ${pluralize(
                          node.name,
                          Number(count)
                        )}`}
                      </option>
                    )
                  })}
                </Select>
                {element.isFieldSet && selectedTd && (
                  <Select
                    label='instanceSelector'
                    icon='tree'
                    mb={theme.s2}
                    w='100%'
                    handleChange={handleNestedTdSelected}
                    disabled={nestedTds().length < 2}
                  >
                    {nestedTds().map((node, index) => {
                      const count = relevancesCount(node)
                      return (
                        <option
                          key={node.id}
                          value={node.id}
                          selected={node.id === selectedNestedTd.id}
                        >
                          {index
                            ? `In ${count} ${pluralize(
                                node.name,
                                Number(count)
                              )}`
                            : 'In Project'}
                        </option>
                      )
                    })}
                  </Select>
                )}
              </Flex>
            </Box>
          </Flex>
        </Box>
        {!isFieldsetEntireProject && (
          <Box p={theme.s3} bg='#1F242D'>
            <Flex flex={1}>
              <Box width='100%'>
                <Flex direction='column'>
                  <Input
                    flex
                    label='search'
                    icon='search'
                    width='100%'
                    onChange={value => setSearch(value.toLowerCase())}
                    onChangeDebounceDuration={300}
                    mb={theme.s2}
                    placeholder={`Search ${pluralize(
                      selectedTdByElementType.name
                    )}...`}
                  />
                </Flex>
                {Boolean(Object.keys(groupedTis).length) ? (
                  <CheckboxList
                    someChecked={hasTiRelevance(
                      element,
                      filteredInstanceIds(),
                      any
                    )}
                    allChecked={allChecked}
                    onAllChecked={handleAllChecked}
                    label={`All ${pluralize(selectedTd.name)}`}
                  >
                    {Object.keys(groupedTis).map(groupId => {
                      const parentTi = getTi(groupId)
                      return parentTi ? (
                        <SectionItem
                          key={groupId}
                          heading={
                            <TreeAncestorBreadcrumb
                              rootTd={rootTd}
                              selectedTd={selectedTdByElementType}
                              branch={tIgetBranch(rootTi, parentTi)}
                              bcItemWidthBuffer={55}
                              shortText
                            />
                          }
                          allChecked={allChecked}
                          displayFlat={parentTi.id === rootTi.id}
                          element={element}
                          tis={groupedTis[groupId]}
                          updateRelevance={updateRelevance}
                        />
                      ) : null
                    })}
                  </CheckboxList>
                ) : (
                  <Text small color='white'>
                    No {pluralize(selectedTdByElementType.name)} found
                  </Text>
                )}
              </Box>
            </Flex>
          </Box>
        )}
      </Flex>
    </Box>
  )
}
