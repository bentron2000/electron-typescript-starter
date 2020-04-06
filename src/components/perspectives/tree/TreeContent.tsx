import * as React from 'react'
import pluralize from 'pluralize'

import { useStoreState, useStoreActions } from '@redux/store'
import {
  TreeInstance,
  tIflatMap,
  buildTreeInstance,
} from '@models/TreeInstance'
import { LoupeRealmErrorResponse } from '@models/ipc'

import { Flex, Loading, Box, Heading, Text } from '@components/shared'
import { theme } from '@components/shared/Theme/theme'
import { useToasts } from '@components/shared/toast/ToastProvider'
import { TITreeItem } from '@components/helpers/treeHelpers'
import { TreeInstances } from './TreeInstances'
import { TreeDefinitions } from './TreeDefinitions'
import { FlatTreeInstances } from './FlatTreeInstances'

const ToastContent = ({
  action,
  elementCount,
}: {
  action: string
  elementCount: number
}) => {
  return (
    <>
      Tree Instance {action} and related to{' '}
      <strong>
        {elementCount} brief {pluralize('elements', elementCount)}
      </strong>
      .
    </>
  )
}

export const TreeContent = () => {
  const { addToast } = useToasts()
  const rootTD = useStoreState(state => state.project.tree.rootTD)
  const selectedTD = useStoreState(state => state.treePerspective.td.current)
  const rootTI = useStoreState(state => state.project.tree.rootTI)
  const project = useStoreState(s => s.project.current)
  const selectedTI = useStoreState(state => state.treePerspective.ti.current)
  const selectTI = useStoreActions(actions => actions.treePerspective.ti.set)
  const clearTI = useStoreActions(actions => actions.treePerspective.ti.clear)
  const getTD = useStoreState(state => state.project.tree.getTD)
  const getTI = useStoreState(state => state.project.tree.getTI)
  const createTI = useStoreActions(actions => actions.treePerspective.ti.create)
  const updateTI = useStoreActions(actions => actions.treePerspective.ti.update)
  const deleteTI = useStoreActions(actions => actions.treePerspective.ti.delete)
  const isAdminMode = useStoreState(store => store.app.isAdminMode)
  const currentPermissions = useStoreState(
    store => store.user.seats.currentPermissions
  )
  const updatePerspectiveData = useStoreActions(
    a => a.app.updatePerspectiveData
  )

  const isAdmin = Boolean(
    currentPermissions && currentPermissions.admin && isAdminMode
  )
  const [loadingTi, setLoadingTi] = React.useState(false)
  const [loadedTi, setLoadedTi] = React.useState(false)
  // Toggle InlineEdit editing view of TD by ID (this is set on create)
  const [toggleEditTiId, setToggleEditTiId] = React.useState('')

  const setLoadingTiOff = () => {
    setLoadedTi(true)
    // Adds delay for loading animation
    setTimeout(() => {
      setLoadedTi(false)
      setLoadingTi(false)
    }, 400)
  }

  const handleSelectTi = (node: TreeInstance) => {
    selectTI(node)
    updatePerspectiveData({
      id: 'tree',
      data: { rhpTitle: node.name },
    })
  }

  const handleCreateTi = (node: TreeInstance) => {
    setLoadingTi(true)
    createTI(node)
      .then(({ data }: { data: TreeInstance }) => {
        addToast(
          <ToastContent action='created' elementCount={data.elements.length} />
        )
        updatePerspectiveData({
          id: 'tree',
          data: { rhpTitle: data.name },
        })
        selectTI(data)
        setToggleEditTiId(data.id)
      })
      .finally(setLoadingTiOff)
      .catch((err: LoupeRealmErrorResponse) => {
        addToast(err.message, { type: 'negative' })
      })
  }

  const handleCreateTiFromTree = ({
    id: tdId,
    parent = rootTI,
  }: TITreeItem) => {
    if (tdId && parent) {
      handleCreateTi(
        buildTreeInstance({
          parentId: parent.id,
          definitionId: tdId,
        })
      )
    }
  }

  const handleUpdateTi = (node: TreeInstance, name: string) => {
    if (name.length && name !== node.name) {
      setLoadingTi(true)
      node.name = name
      updateTI(node)
        .then(() => {
          updatePerspectiveData({
            id: 'tree',
            data: { rhpTitle: name },
          })
          setToggleEditTiId('')
        })
        .finally(setLoadingTiOff)
        .catch((err: LoupeRealmErrorResponse) => {
          addToast(err.message, { type: 'negative' })
        })
    }
  }

  const handleDeleteTi = (node: TreeInstance) => {
    deleteTI(tIflatMap(node, ti => ti.id))
      .then(() => {
        addToast('Tree Instance deleted')
        updatePerspectiveData({ id: 'tree' })
        setToggleEditTiId('')
      })
      .finally(setLoadingTiOff)
      .catch((err: LoupeRealmErrorResponse) => {
        addToast(err.message, { type: 'negative' })
      })
  }

  const handleDuplicateTi = (node: TreeInstance) => {
    setLoadingTi(true)
    createTI(node)
      .then(({ data }: { data: TreeInstance }) => {
        addToast(
          <ToastContent
            action='duplicated'
            elementCount={data.elements.length}
          />
        )
      })
      .finally(setLoadingTiOff)
      .catch((err: LoupeRealmErrorResponse) => {
        addToast(err.message, { type: 'negative' })
      })
  }

  return (
    <div
      style={{
        display: 'flex',
        flex: '1',
        background: theme.grayDarker,
      }}
    >
      {loadingTi && <Loading loaded={loadedTi} />}
      <Flex direction='column'>
        <Box width='auto' p='46px 0px 0px 32px'>
          <Heading size='large'>Define Tree</Heading>
          <Text small color={theme.grayLight}>
            The Loupe Tree definition is a taxonomy that dictates how your
            assets and brief information will be organised.
          </Text>
        </Box>
        <Box
          bg={theme.grayDarkest}
          height='100%'
          width='auto'
          m={theme.s4}
          radius='4px'
          overflow='scroll'
        >
          {rootTD && project && (
            <TreeDefinitions
              rootTD={rootTD}
              project={project}
              selectedTD={selectedTD}
              clearSelectedTI={clearTI}
              isAdminMode={isAdmin}
            />
          )}
        </Box>
      </Flex>
      <Flex direction='column'>
        <Box width='auto' p='46px 32px 0px 0px'>
          <Heading size='large'>Populate Tree</Heading>
          <Text small color={theme.grayLight}>
            Populate the Loupe Tree with item names to fit your defined
            structure - much like a shot list for your project.
          </Text>
        </Box>
        <Box
          bg={theme.grayDarkest}
          height='100%'
          width='auto'
          m={theme.s4}
          ml='0'
          radius='4px'
          overflow='auto'
        >
          {rootTI &&
            rootTD &&
            (selectedTD ? (
              <FlatTreeInstances
                rootTD={rootTD}
                rootTI={rootTI}
                selectedTD={selectedTD}
                selectTI={handleSelectTi}
                selectedTI={selectedTI}
                createTI={handleCreateTi}
                updateTI={handleUpdateTi}
                duplicateTI={handleDuplicateTi}
                deleteTI={handleDeleteTi}
                getTI={getTI}
                getTD={getTD}
                isAdminMode={isAdmin}
                toggleEditTiId={toggleEditTiId}
              />
            ) : (
              <TreeInstances
                rootTI={rootTI}
                selectTI={handleSelectTi}
                selectedTI={selectedTI}
                createTI={handleCreateTiFromTree}
                updateTI={handleUpdateTi}
                duplicateTI={handleDuplicateTi}
                deleteTI={handleDeleteTi}
                getTD={getTD}
                isAdminMode={isAdmin}
                toggleEditTiId={toggleEditTiId}
              />
            ))}
        </Box>
      </Flex>
    </div>
  )
}
