import * as React from 'react'
import SortableTree, { ThemeProps, TreeItem } from 'react-sortable-tree'
import * as InstanceTheme from 'loupe-asset-tree'

import { TreeInstance } from '@models/TreeInstance'
import { TreeDefinition } from '@models/TreeDefinition'
import { TITreeItem, tiToTreeItemV2 } from '@components/helpers/treeHelpers'

import { Text, Flex, Button, InlineEdit2 } from '@components/shared'
import { theme } from '@components/shared/Theme/theme'

import { TreeNode, EditableTreeNode, AddTreeNode } from './TreeNode'

interface ITreeInstances {
  rootTI: TreeInstance
  selectedTI: TreeInstance | undefined
  selectTI: (node: TreeInstance) => void
  getTD: (id: string) => TreeDefinition | undefined
  createTI: (treeItem: TreeItem) => void
  updateTI: (node: TreeInstance, name: string) => void
  duplicateTI: (node: TreeInstance) => void
  deleteTI: (node: TreeInstance) => void
  addNode?: React.ReactNode
  isAdminMode: boolean
  toggleEditTiId?: string
}

export const TreeInstances = ({
  rootTI,
  selectedTI,
  selectTI,
  createTI,
  updateTI,
  duplicateTI,
  deleteTI,
  getTD,
  isAdminMode,
  toggleEditTiId,
}: ITreeInstances) => {
  const instanceTheme = InstanceTheme as ThemeProps
  const buildTree = () => tiToTreeItemV2(rootTI, getTD, isAdminMode)
  const [treeData, setTreeData] = React.useState(buildTree())

  const isSelected = (node: TreeItem) =>
    Boolean(selectedTI && node.id === selectedTI.id)

  const handleSaveInlineEdit = (val: string, ti: TreeInstance) => {
    updateTI(ti, val)
    setTreeData(buildTree())
  }

  React.useEffect(() => setTreeData(buildTree()), [rootTI, isAdminMode])

  return treeData.length ? (
    <SortableTree
      canDrag={false}
      theme={instanceTheme}
      treeData={treeData}
      onChange={tData => setTreeData(tData as TITreeItem[])}
      generateNodeProps={({ node }) => ({
        listIndex: 0,
        lowerSiblingCounts: [],
        title: (
          <>
            {!node.addButton ? (
              <InlineEdit2
                minimal
                doubleClickToEdit
                value={node.name}
                toggleEditView={node.id === toggleEditTiId}
                onClick={() => selectTI(node.node)}
                onDblClick={() => selectTI(node.node)}
                readView={readProps => (
                  <TreeNode selected={isSelected(node)} {...readProps}>
                    {node.name}
                  </TreeNode>
                )}
                editView={editProps => (
                  <EditableTreeNode
                    selected={isSelected(node)}
                    {...editProps}
                  />
                )}
                onSave={val => handleSaveInlineEdit(val, node.node)}
              />
            ) : (
              <AddTreeNode dotted onClick={() => createTI(node)}>
                {node.name}
              </AddTreeNode>
            )}
          </>
        ),
        buttons: !node.addButton
          ? [
              <Flex direction='row' key={node.id}>
                {node.canEdit && (
                  <>
                    <Button
                      padding='0'
                      icon='close'
                      hoverColor='white'
                      color={theme.grayLight}
                      onClick={() => deleteTI(node.node)}
                    />
                    <Button
                      padding='0'
                      icon='duplicate'
                      hoverColor='white'
                      color={theme.grayLight}
                      onClick={() => duplicateTI(node.node)}
                    />
                  </>
                )}
                <Text color={theme.grayLight} subtitle mb='0' ml={theme.s2}>
                  {node.tdName && node.tdName}
                </Text>
              </Flex>,
            ]
          : [],
      })}
    />
  ) : (
    <Text body align='center'>
      You do not have permissions to create views
    </Text>
  )
}
