import * as React from 'react'
import pluralize from 'pluralize'

import { tDflatMap, tDfindById, tDfilter } from '@models/TreeDefinition'
import { useStoreState, useStoreActions } from '@redux/store'
import { PendingAsset, TreeInstance } from '@models'
import { LoupeRealmErrorResponse } from '@models/ipc'
import { useGridSelect } from '@components/helpers/useGridSelect'

import { MatchingLeftPanel } from './MatchingLeftPanel'
import { MatchingRightPanel } from './MatchingRightPanel'
import { useToasts } from '../shared/toast/ToastProvider'
import { Flex, Select, Heading, Text, Box, Loading } from '../shared'
import { theme } from '../shared/Theme/theme'
import { tIflatMap } from '@models/TreeInstance'

export interface MatchingContent {}

export const MatchingContent = () => {
  // Matching
  const unmatchedAssets = useStoreState(s => s.matching.match.unMatchedAssets)
  const [selected, setSelected, clearSelected] = useGridSelect<PendingAsset>(
    unmatchedAssets
  )
  const matches = useStoreState(state => state.matching.match.matches)
  const addMatch = useStoreActions(actions => actions.matching.match.addMatch)

  // Right Panel
  const { addToast } = useToasts()
  const rootTD = useStoreState(state => state.project.tree.rootTD)
  const selectedTD = useStoreState(state => state.matching.ui.selectedTd)
  const selectTD = useStoreActions(actions => actions.matching.ui.selectTd)
  const rootTI = useStoreState(state => state.project.tree.rootTI)
  const selectedTI = useStoreState(state => state.treePerspective.ti.current)
  const selectTI = useStoreActions(actions => actions.treePerspective.ti.set)
  const getTD = useStoreState(state => state.project.tree.getTD)
  const getTI = useStoreState(state => state.project.tree.getTI)
  const createTI = useStoreActions(actions => actions.treePerspective.ti.create)
  const updateTI = useStoreActions(actions => actions.treePerspective.ti.update)
  const deleteTI = useStoreActions(actions => actions.treePerspective.ti.delete)
  const isAdminMode = useStoreState(store => store.app.isAdminMode)
  const currentPermissions = useStoreState(
    store => store.user.seats.currentPermissions
  )
  const currentProject = useStoreState(store => store.project.current)
  const currentStage = useStoreState(
    state => state.assetPerspective.stage.current
  )

  const isAdmin =
    !!currentPermissions && currentPermissions.admin && isAdminMode
  const [loadingTi, setLoadingTi] = React.useState(false)
  const [loadedTi, setLoadedTi] = React.useState(false)

  const rightProps = {
    matches,
    addMatch,
    selected,
  }

  const setLoadingTiOff = () => {
    setLoadedTi(true)
    // Adds delay for loading animation
    setTimeout(() => {
      setLoadedTi(false)
      setLoadingTi(false)
    }, 400)
  }

  const handleCreateTi = (node: TreeInstance) => {
    setLoadingTi(true)
    createTI(node)
      .finally(setLoadingTiOff)
      .catch((err: LoupeRealmErrorResponse) => {
        addToast(err.message, { type: 'negative' })
      })
  }

  const handleUpdateTi = (node: TreeInstance, name: string) => {
    setLoadingTi(true)
    node.name = name
    updateTI(node)
      .finally(setLoadingTiOff)
      .catch((err: LoupeRealmErrorResponse) => {
        addToast(err.message, { type: 'negative' })
      })
  }

  const handleDeleteTi = (node: TreeInstance) => {
    deleteTI(tIflatMap(node, ti => ti.id))
      .finally(setLoadingTiOff)
      .catch((err: LoupeRealmErrorResponse) => {
        addToast(err.message, { type: 'negative' })
      })
  }

  const handleDuplicateTi = (node: TreeInstance) => {
    setLoadingTi(true)
    createTI(node)
      .finally(setLoadingTiOff)
      .catch((err: LoupeRealmErrorResponse) => {
        addToast(err.message, { type: 'negative' })
      })
  }

  // Find TDs with mediaAllowed = true
  const mediaAllowedTDs = rootTD && tDfilter(rootTD, td => td.mediaAllowed)

  // Map TDs to select options
  const definitionSelector =
    rootTD &&
    tDflatMap(
      rootTD,
      node => (
        <>
          {node.mediaAllowed && (
            <option
              key={node.id}
              value={node.id}
              selected={selectedTD && node.id === selectedTD.id}
            >
              {pluralize(node.name)}
            </option>
          )}
        </>
      ),
      true
    )

  // Handle TD selection
  const handleDefinitionSelected = (value: string) => {
    const td = rootTD && tDfindById(rootTD, value)[0]
    if (td) {
      selectTD(td)
    }
  }

  // Left Panel
  const pendingAssets = useStoreState(state => state.matching.pending.assets)
  const zoom = useStoreState(state => state.matching.ui.zoom)
  const removeMatch = useStoreActions(
    actions => actions.matching.match.removeMatch
  )

  const leftProps = {
    pendingAssets,
    unmatchedAssets,
    selected,
    setSelected,
    zoom,
    matches,
    addMatch,
    removeMatch,
  }

  // Default TD selection on component instantiation
  React.useEffect(() => {
    if (mediaAllowedTDs) {
      if (!selectedTD || !mediaAllowedTDs.find(td => td.id === selectedTD.id)) {
        selectTD(mediaAllowedTDs[0])
      }
    }
  }, [])

  return (
    <Flex direction='row' justify='space-between'>
      {loadingTi && <Loading loaded={loadedTi} />}
      <Box
        bg={theme.grayDarker}
        p='24px 46px 24px 24px'
        width='100%'
        overflow='scroll'
        mb='-16px'
      >
        <Flex direction='row' justify='space-between' align='center'>
          <Flex direction='column'>
            <Heading size='large' mb={theme.s2} color={theme.white}>
              Source
            </Heading>
            <Text bold body color={theme.grayLight} mb={theme.s3}>
              Local Drive:&nbsp;
              {pendingAssets.length} Assets
            </Text>
          </Flex>
        </Flex>
        <Box
          bg='rgba(27,32,42,0.3)'
          p='16px 16px 0px 16px'
          width='100%'
          height='auto'
          radius='4px'
        >
          <MatchingLeftPanel {...leftProps} />
        </Box>
      </Box>
      <Box
        bg={theme.grayDarker}
        p='24px'
        width='100%'
        overflow='scroll'
        mb='-16px'
      >
        <Flex direction='column'>
          <Flex direction='row' justify='space-between' mb={theme.s3}>
            {loadingTi && <Loading loaded={loadedTi} />}
            <Flex direction='column'>
              <Heading size='large' mb={theme.s2} color={theme.white}>
                Destination
              </Heading>
              <Text bold body color={theme.grayLight} mb='0' display='inline'>
                {`${currentProject && currentProject.name}: ${currentStage &&
                  currentStage.name} Stage`}
              </Text>
            </Flex>
            <Flex flex={0} align='flex-end' justify='flex-end'>
              {mediaAllowedTDs && mediaAllowedTDs.length > 1 && (
                <Select
                  label='definitionSelector'
                  icon='tree'
                  mb={theme.s2}
                  w='100%'
                  handleChange={value => handleDefinitionSelected(value)}
                >
                  {...[definitionSelector]}
                </Select>
              )}
            </Flex>
          </Flex>
          <Box bg='rgba(27,32,42,0.3)' width='100%' height='100%' radius='4px'>
            {rootTI &&
              rootTD &&
              (selectedTD ? (
                <MatchingRightPanel
                  rootTD={rootTD}
                  rootTI={rootTI}
                  selectedTD={selectedTD}
                  selectTI={selectTI}
                  selectedTI={selectedTI}
                  createTI={handleCreateTi}
                  updateTI={handleUpdateTi}
                  duplicateTI={handleDuplicateTi}
                  deleteTI={handleDeleteTi}
                  getTI={getTI}
                  getTD={getTD}
                  isAdminMode={!!isAdmin}
                  zoom={zoom}
                  clearSelected={clearSelected}
                  {...rightProps}
                />
              ) : (
                <Text body>Loading...</Text>
              ))}
          </Box>
        </Flex>
      </Box>
    </Flex>
  )
}
