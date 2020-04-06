import * as React from 'react'
import pluralize from 'pluralize'
import styled from 'styled-components'

import { useStoreActions } from '@redux/store'
import { Match, Matches } from '@models/Match'
import { TreeInstance } from '@models/TreeInstance'
import { TreeDefinition } from '@models/TreeDefinition'
import { PendingAsset } from '@models/PendingAsset'
import { tiToFlatTreeItems } from '@components/helpers/treeHelpers'

import { theme } from '../shared/Theme/theme'
import {
  Asset,
  Grid,
  Box,
  Flex,
  Button,
  DropButton,
  InlineEdit,
  Heading,
  Text,
  Subsection,
  Icon,
  TreeAncestorBreadcrumb,
} from '../shared'
import { tIgetBranch, buildTreeInstance } from '@models/TreeInstance'

const InstanceOL = styled.ol`
  padding: 0;
  margin: 0;
`

const InstanceControls = styled(Flex)`
  flex: 0;
  opacity: 0;
`

const InstanceLI = styled.li`
  color: ${theme.grayLighter};
  padding: ${theme.s3};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 200ms;
  border-bottom: 1px solid #1c212c;
  cursor: pointer;
  &:hover ${InstanceControls} {
    opacity: 1;
  }
  &:hover {
    color: white;
  }
`

export const NodeHeading = styled(Heading)<{ selected: boolean }>`
  color: ${props => (props.selected ? theme.primary : 'inherit')};
  border: ${props => (props.selected ? `1px solid ${theme.primary}` : 'none')};
  padding: ${props => (props.selected ? `${theme.s1} ${theme.s2}` : 0)};
  margin: ${props => (props.selected ? `-5px 0` : 0)};
  border-radius: 25px;
`

const AddNode = styled.div`
  transition: all 200ms;
  width: 100%;
  position: relative;
  height: 100%;
  font-style: italic;
  color: #4c5560;
  display: flex;
  align-items: center;
  :hover {
    color: ${theme.primary};
  }
`

interface MatchingRightPanel {
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
  selected: PendingAsset[]
  matches: Matches
  addMatch: (payload: Match) => void
  zoom: number
  clearSelected: () => void
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

export const MatchingRightPanel = ({
  rootTD,
  rootTI,
  selectedTD,
  selectTI,
  createTI,
  updateTI,
  duplicateTI,
  deleteTI,
  getTI,
  getTD,
  isAdminMode,
  matches,
  addMatch,
  selected,
  clearSelected,
  zoom,
}: MatchingRightPanel) => {
  const parentTd = selectedTD.parentId ? getTD(selectedTD.parentId) : undefined
  const canCreateViews = isAdminMode || selectedTD.collaboratorMode
  const [groupedTis, setGroupedTis] = React.useState<{
    [key: string]: TreeInstance[]
  }>({})
  const updatePerspectiveData = useStoreActions(
    a => a.app.updatePerspectiveData
  )

  const matchToInstance = (ti: TreeInstance) => {
    if (selected.length > 0) {
      addMatch({
        id: ti.id,
        assets: [
          ...(matches[ti.id] ? matches[ti.id].assets : []),
          ...(matches[ti.id]
            ? selected.filter(s => !matches[ti.id].assets.includes(s))
            : selected),
        ],
        assignment: ti,
      })
    }
    clearSelected()
  }

  React.useEffect(
    () =>
      setGroupedTis(tiToFlatTreeItems(selectedTD, parentTd, canCreateViews)),
    [selectedTD, isAdminMode]
  )

  const sectionRef = React.useRef<HTMLDivElement>(null)

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
                    {groupedTis[tiId].map(inst => (
                      <Flex key={inst.id}>
                        <Box width='100%' refNode={sectionRef}>
                          <InstanceLI
                            onClick={() => {
                              selectTI(inst)
                              updatePerspectiveData({
                                id: 'tree',
                                data: { rhpTitle: inst.name },
                              })
                            }}
                          >
                            <Flex
                              p={`0 0 ${theme.s3} 0`}
                              justify='space-between'
                            >
                              <InlineEdit
                                minimal
                                p='4px'
                                disabled={!canCreateViews}
                                saveContent={title => {
                                  updateTI(inst, title)
                                  updatePerspectiveData({
                                    id: 'tree',
                                    data: { rhpTitle: title },
                                  })
                                }}
                              >
                                <NodeHeading mb='0' size='small'>
                                  {inst.name}
                                </NodeHeading>
                              </InlineEdit>
                              {canCreateViews && (
                                <InstanceControls>
                                  <Button
                                    padding='0'
                                    icon='close'
                                    hoverColor='white'
                                    color={theme.grayLight}
                                    onClick={() => deleteTI(inst)}
                                  />
                                  <Button
                                    padding='0'
                                    icon='duplicate'
                                    hoverColor='white'
                                    color={theme.grayLight}
                                    onClick={() => duplicateTI(inst)}
                                  />
                                </InstanceControls>
                              )}
                            </Flex>
                            <Box>
                              {inst.mediaAllowed && !matches[inst.id] && (
                                <DropButton
                                  disabled={selected.length === 0}
                                  iconName='download'
                                  text={
                                    selected.length === 0
                                      ? 'Select assets to add on the left...'
                                      : 'Drag here or click to add'
                                  }
                                  onClick={() => matchToInstance(inst)}
                                />
                              )}
                              {/* Note if this instance has neither children nor mediaAllowed */}
                              {inst.children.length === 0 &&
                                !inst.mediaAllowed && (
                                  <Text body>No Instances</Text>
                                )}
                              {/* TODO: Media Items already connected to this instance */}
                              {/* TODO: Adding a new tree instance if we're allowed - modal? */}
                              {inst.mediaAllowed && matches[inst.id] && (
                                <Grid zoom={zoom}>
                                  {matches[inst.id].assets.map(item => (
                                    <Asset
                                      src={item.thumbnail}
                                      key={item.id}
                                      confirmed={
                                        <>
                                          <Box mb={theme.s2} color='white'>
                                            <Icon name='tick' width='32px' />
                                          </Box>
                                          <Text subtitle color='white' mb='0'>
                                            Added Manually
                                          </Text>
                                        </>
                                      }
                                    />
                                  ))}
                                  {matches[inst.id].assets.length > 0 &&
                                    selected.length > 0 && (
                                      <DropButton
                                        square
                                        iconName='download'
                                        onClick={() => matchToInstance(inst)}
                                      />
                                    )}
                                </Grid>
                              )}
                            </Box>
                          </InstanceLI>
                        </Box>
                      </Flex>
                    ))}
                    {canCreateViews && (
                      <Flex>
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
                          <AddNode>
                            <Icon name='add' width='32px' />
                            <NodeHeading mb='0' size='small'>
                              Add {selectedTD.name}
                            </NodeHeading>
                          </AddNode>
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
