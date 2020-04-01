import * as React from 'react'
import SortableTree, { ThemeProps, TreeItem } from 'react-sortable-tree'
import * as InstanceTheme from 'loupe-instance-tree'
import styled, { css } from 'styled-components'
import { Box, Text } from '..'
import { theme } from '../Theme/theme'
import { TITreeItem } from '@components/helpers'

const NodeButton = styled.button`
  border-radius: 24px;
  outline: none;
  border: 0px;
  background: none;
  color: inherit;
  padding: 0px;
  cursor: pointer;
  ${({ selected }: { selected?: boolean }) =>
    selected &&
    css`
      border: 1px solid ${theme.primary};
      color: ${theme.primary};
      margin: -1px;
      padding: 4px 12px;
    `};
`

export interface TreeView {
  tree: TITreeItem[]
  currentSelection?: string[]
  handleClick?: (id: string) => void
}

export const TreeViewPane = ({
  tree,
  currentSelection,
  handleClick,
}: TreeView) => {
  const instanceTheme = InstanceTheme as ThemeProps

  const [treeData, setTreeData] = React.useState<TreeItem[]>(tree)

  React.useEffect(() => {
    setTreeData(tree)
  }, [tree])

  return (
    <Box p='0 2.5%' height='100%' width='95%' bg={theme.grayDarkest}>
      <SortableTree
        theme={instanceTheme}
        treeData={treeData}
        onChange={tData => setTreeData(tData)}
        canDrag={false}
        isVirtualized={false}
        generateNodeProps={({ node }) => ({
          listIndex: 0,
          lowerSiblingCounts: [],
          title: [
            <NodeButton
              key={node.id}
              selected={
                currentSelection && currentSelection.includes(node.id)
                  ? true
                  : false
              }
              onClick={() => handleClick && handleClick(node.id)}
            >
              <Text color='inherit' mb='0' small>
                {node.name}
              </Text>
            </NodeButton>,
          ],
        })}
      />
    </Box>
  )
}
