import * as React from 'react'
import pluralize from 'pluralize'
import styled from 'styled-components'
import { tiToFlatTreeItems } from '@components/helpers/treeHelpers'
import { tIgetBranch, buildTreeInstance } from '@models/TreeInstance'
import { TreeInstance, TreeDefinition } from '@models'
import {
  Box,
  Flex,
  Button,
  InlineEdit2,
  Text,
  Subsection,
  TreeAncestorBreadcrumb,
  theme,
} from '@components/shared'
import { TreeNode, AddTreeNode, EditableTreeNode } from './TreeNode'

const InstanceOL = styled.ol`
  padding: 0;
  margin: 0;
  > div:not(:last-child) li {
    border-bottom: 1px solid #1c212c;
  }
`

const InstanceControls = styled(Flex)`
  flex: 0;
  opacity: 0;
`

const InstanceBranch = styled.div<{ dashed?: boolean }>`
  position: absolute;
  left: ${theme.s3};
  top: -36px;
  width: 36px;
  height: 66px;
  border-left: ${props =>
    props.dashed ? `2px dashed #313844` : `2px solid #313844`};
  border-bottom: ${props =>
    props.dashed ? `2px dashed #313844` : `2px solid #313844`};
`

const InstanceLI = styled.li`
  position: relative;
  width: 100%;
  color: ${theme.grayLighter};
  padding: ${theme.s2};
  padding-left: 0;
  margin-left: ${theme.s5};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  transition: all 200ms;
  cursor: pointer;
  &:hover ${InstanceControls} {
    opacity: 1;
  }
  &:hover {
    color: white;
  }
`

interface IFlatTreeInstances {
  rootTD: TreeDefinition
  rootTI: TreeInstance
  selectedTD: TreeDefinition
  selectedTI: TreeInstance | undefined
  selectTI: (node: TreeInstance) => void
  createTI: (node: TreeInstance) => void
  updateTI: (node: TreeInstance, name: string) => void
  duplicateTI: (node: TreeInstance) => void
  deleteTI: (node: TreeInstance) => void
  getTI: (id: string) => TreeInstance | undefined
  getTD: (id: string) => TreeDefinition | undefined
  isAdminMode: boolean
  tooltipRef?: React.RefObject<any>
  toggleEditTiId?: string
}

const NoParentInstancesMessage = ({
  td,
  parentTd,
  canCreateViews,
}: {
  td: TreeDefinition
  parentTd: TreeDefinition | undefined
  canCreateViews: boolean
}) => {
  const pTdName = pluralize(td.name)
  const msg = !canCreateViews
    ? `You do not have permissions to create '${pTdName}'`
    : parentTd
    ? `Create at least one '${parentTd.name}' before you can create '${pTdName}'.`
    : `No parent views to create '${pTdName}' within.`

  return (
    <Text body align='center'>
      {msg}
    </Text>
  )
}

export const FlatTreeInstances = ({
  rootTD,
  rootTI,
  selectedTD,
  selectedTI,
  selectTI,
  createTI,
  updateTI,
  duplicateTI,
  deleteTI,
  getTI,
  getTD,
  isAdminMode,
  toggleEditTiId,
}: IFlatTreeInstances) => {
  const parentTd = selectedTD.parentId ? getTD(selectedTD.parentId) : undefined
  const canCreateViews = isAdminMode || selectedTD.collaboratorMode
  const buildGroupedTIs = () =>
    tiToFlatTreeItems(selectedTD, parentTd, canCreateViews)
  const [groupedTis, setGroupedTis] = React.useState<{
    [key: string]: TreeInstance[]
  }>({})

  const isSelected = (node: TreeInstance) =>
    Boolean(selectedTI && selectedTI.id === node.id)

  const handleSaveInlineEdit = (val: string, ti: TreeInstance) => {
    updateTI(ti, val)
    setGroupedTis(buildGroupedTIs())
  }

  React.useEffect(() => setGroupedTis(buildGroupedTIs()), [
    selectedTD,
    isAdminMode,
  ])

  return (
    <>
      {selectedTD && Object.keys(groupedTis).length ? (
        Object.keys(groupedTis).map(tiId => {
          const ti = getTI(tiId)
          return (
            ti && (
              <Box width='100%' key={tiId}>
                <Subsection
                  bg={theme.grayDark}
                  minimal
                  expanded
                  heading={
                    <TreeAncestorBreadcrumb
                      rootTd={rootTD}
                      selectedTd={selectedTD}
                      branch={tIgetBranch(rootTI, ti)}
                      bcItemWidthBuffer={55}
                    />
                  }
                >
                  <InstanceOL>
                    {groupedTis[tiId].map((node: TreeInstance) => (
                      <Flex key={node.id}>
                        <Flex width='100%'>
                          <InstanceBranch />
                          <InstanceLI>
                            <div>
                              <InlineEdit2
                                minimal
                                doubleClickToEdit
                                value={node.name}
                                toggleEditView={node.id === toggleEditTiId}
                                disabled={!canCreateViews}
                                onClick={() => selectTI(node)}
                                onDblClick={() => selectTI(node)}
                                readView={readProps => (
                                  <TreeNode
                                    selected={isSelected(node)}
                                    {...readProps}
                                  >
                                    {node.name}
                                  </TreeNode>
                                )}
                                editView={editProps => (
                                  <EditableTreeNode
                                    selected={isSelected(node)}
                                    {...editProps}
                                  />
                                )}
                                onSave={value =>
                                  handleSaveInlineEdit(value, node)
                                }
                              />
                            </div>
                            {canCreateViews && (
                              <InstanceControls>
                                <Button
                                  padding='0'
                                  icon='close'
                                  hoverColor='white'
                                  color={theme.grayLight}
                                  onClick={() => deleteTI(node)}
                                />
                                <Button
                                  padding='0'
                                  icon='duplicate'
                                  hoverColor='white'
                                  color={theme.grayLight}
                                  onClick={() => duplicateTI(node)}
                                />
                              </InstanceControls>
                            )}
                          </InstanceLI>
                        </Flex>
                      </Flex>
                    ))}
                    {canCreateViews && (
                      <Flex>
                        <InstanceBranch />
                        <InstanceLI
                          onClick={() =>
                            createTI(
                              buildTreeInstance({
                                parentId: tiId,
                                definitionId: selectedTD.id,
                              })
                            )
                          }
                        >
                          <AddTreeNode>Add {selectedTD.name}</AddTreeNode>
                        </InstanceLI>
                      </Flex>
                    )}
                  </InstanceOL>
                </Subsection>
              </Box>
            )
          )
        })
      ) : (
        <NoParentInstancesMessage
          td={selectedTD}
          parentTd={parentTd}
          canCreateViews={canCreateViews}
        />
      )}
    </>
  )
}
