import * as React from 'react'
import { ActionCreator } from 'easy-peasy'
import SortableTree, { ThemeProps, TreeItem } from 'react-sortable-tree'
import * as DefinitionTheme from 'loupe-definition-tree'
import pluralize from 'pluralize'

import { useStoreActions } from '@redux/store'
import { Project } from '@models/Project'
import { TreeDefinition, buildTreeDefinition } from '@models/TreeDefinition'

import {
  Box,
  Button,
  Flex,
  Icon,
  InlineEdit2,
  useToasts,
  theme,
} from '@components/shared'
import { tdToTreeItem, useRealmQuery } from '@components/helpers'

import { TreeNode, EditableTreeNode, AddTreeNode } from './TreeNode'

interface TreeDefinitions {
  rootTD: TreeDefinition
  project: Project
  selectedTD: TreeDefinition | undefined
  clearSelectedTI: ActionCreator<void>
  isAdminMode: boolean
}

export const TreeDefinitions = ({
  rootTD,
  project,
  isAdminMode,
  selectedTD,
  clearSelectedTI,
}: TreeDefinitions) => {
  const { addToast } = useToasts()
  const definitionTheme = DefinitionTheme as ThemeProps
  const updatePerspectiveData = useStoreActions(
    a => a.app.updatePerspectiveData
  )
  const selectTd = useStoreActions(a => a.treePerspective.td.set)
  const createTd = useStoreActions(a => a.treePerspective.td.create)
  const updateTd = useStoreActions(a => a.treePerspective.td.update)
  const deleteTd = useStoreActions(a => a.treePerspective.td.delete)
  const clearSelectedTD = useStoreActions(a => a.treePerspective.td.clear)

  const buildTree = () =>
    rootTD ? rootTD.children.map(td => tdToTreeItem(td, isAdminMode)) : []
  const [treeData, setTreeData] = React.useState<TreeItem[]>(buildTree())
  const [createTdQuery, { loading: createLoading }] = useRealmQuery<
    TreeDefinition
  >(createTd)
  const [updateTdQuery] = useRealmQuery<TreeDefinition>(updateTd)
  const [deleteTdQuery, { loading: deleteLoading }] = useRealmQuery<string>(
    deleteTd
  )
  // Toggle InlineEdit editing view of TD by ID (this is set on create)
  const [editTdId, setEditTdId] = React.useState('')

  const isSelected = (node: TreeItem) =>
    Boolean(selectedTD && selectedTD.id === node.id)

  const setSelectedTd = (node: TreeDefinition) => {
    selectTd(node)
    updatePerspectiveData({
      id: 'tree',
      data: { rhpTitle: pluralize(node.name) },
    })
    clearSelectedTI()
  }

  const toggleSelectedTd = (node: TreeDefinition) => {
    if (selectedTD && node.id === selectedTD.id) {
      clearSelectedTD()
      updatePerspectiveData({ id: 'tree' })
    } else {
      setSelectedTd(node)
    }
  }

  const handleUpdateName = (value: string) => {
    if (value.length && selectedTD && value !== selectedTD.name) {
      selectedTD.name = value
      updateTdQuery(selectedTD)
    }
    setEditTdId('')
  }

  const handleDeleteTd = async (td: TreeDefinition) => {
    if (!deleteLoading) {
      const { data } = await deleteTdQuery(td.id)
      if (data) {
        addToast(`"${td.name}" definition deleted`)
      }
    }
  }

  const handleCreateTd = async ({ parentId }: TreeItem) => {
    if (!createLoading) {
      const { data: newTd } = await createTdQuery(
        buildTreeDefinition({ parentId, project: project.id })
      )
      if (newTd) {
        addToast('Created a new level')
        setSelectedTd(newTd)
        setEditTdId(newTd.id)
      }
    }
  }

  React.useEffect(() => setTreeData(buildTree()), [rootTD, isAdminMode])

  return (
    <SortableTree
      canDrag={false}
      theme={definitionTheme}
      treeData={treeData}
      onChange={tData => setTreeData(tData)}
      getNodeKey={({ node }) => node.id}
      generateNodeProps={({ node }) => ({
        listIndex: 0,
        lowerSiblingCounts: [],
        title: (
          <>
            {!node.addButton ? (
              <Flex align='center'>
                {node.node.mediaAllowed && (
                  <Box p='24px 0px 12px 0px' color={theme.blue}>
                    <Icon name='assets' width='32px' />
                  </Box>
                )}
                <InlineEdit2
                  minimal
                  doubleClickToEdit
                  value={node.name}
                  toggleEditView={node.id === editTdId}
                  onClick={() => toggleSelectedTd(node.node)}
                  onDblClick={() => setSelectedTd(node.node)}
                  readView={readProps => (
                    <TreeNode selected={isSelected(node)} {...readProps}>
                      {readProps.value}
                    </TreeNode>
                  )}
                  editView={editProps => (
                    <EditableTreeNode
                      selected={isSelected(node)}
                      {...editProps}
                    />
                  )}
                  onSave={handleUpdateName}
                />
              </Flex>
            ) : (
              <AddTreeNode dotted onClick={() => handleCreateTd(node)}>
                {createLoading ? 'Loading...' : node.name}
              </AddTreeNode>
            )}
          </>
        ),
        buttons:
          !node.addButton && node.canEdit
            ? [
                <Button
                  icon='close'
                  color='inherit'
                  key={node.id}
                  // onMouseDown fires before onBlur, this is needed to allow delete td
                  // when user is editing with InlineEdit.
                  onMouseDown={() => handleDeleteTd(node.node)}
                />,
              ]
            : [],
      })}
    />
  )
}
