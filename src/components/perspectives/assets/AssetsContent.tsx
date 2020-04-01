import * as React from 'react'
import { useStoreState, useStoreActions } from '@redux/store'
import {
  Box,
  Grid,
  Asset,
  Flex,
  Text,
  TreeBreadcrumb,
  FileIcon,
  theme,
} from '@components/shared'
import { Redirect } from 'react-router'
import { Route } from 'react-router-dom'
import styled from 'styled-components'
import { useGridSelect } from '@components/helpers/useGridSelect'
import { MediaState } from '@models'
import { MediaStateFilter } from '@redux/state/AssetPerspective/AssetFilterPart'

const AssetButton = styled.button`
  border: none;
  background: none;
  outline: none;
  padding: 0;
`

export interface AssetsContent {}

export const AssetsContent = () => {
  const rootTd = useStoreState(s => s.project.tree.rootTD)
  const assetsZoom = useStoreState(s => s.assetPerspective.interface.assetsZoom)
  const currentFilter = useStoreState(s => s.assetPerspective.filter.current)
  const setFilter = useStoreActions(a => a.assetPerspective.filter.set)
  const filteredMediaStates = useStoreState(
    s => s.assetPerspective.filter.filteredMediaStates
  )
  const project = useStoreState(s => s.project.current)
  const incomingAssets = useStoreState(s => s.matching.ui.incoming)
  const searchQuery = useStoreState(s => s.app.search.query)
  const incomingAssetsRedirect =
    project && incomingAssets ? `/project/${project.id}/matching` : undefined
  const setCurrentMediaState = useStoreActions(
    a => a.assetPerspective.mediaState.fetch
  )
  const clearCurrentMediaState = useStoreActions(
    a => a.assetPerspective.mediaState.clear
  )
  const updatePerspectiveData = useStoreActions(
    a => a.app.updatePerspectiveData
  )

  const [searchFilteredMS, setSearchFilteredMS] = React.useState(
    filteredMediaStates
  )

  const [selected, onSelect, clearSelected] = useGridSelect(searchFilteredMS)

  React.useEffect(() => {
    updatePerspectiveData({
      id: 'assets',
      data: { rhpTitle: 'Assets Perspective' },
    })
  }, [])

  React.useEffect(() => {
    setSearchFilteredMS(
      filteredMediaStates.filter(ms =>
        ms.name.toLowerCase().includes(searchQuery)
      )
    )
    clearSelected()
  }, [searchQuery, filteredMediaStates])

  const handleDeselect = () => {
    clearCurrentMediaState()
    clearSelected()
  }

  const handleSelect = (
    ms: MediaState,
    event: React.MouseEvent<HTMLElement>
  ) => {
    // TODO: Fancier primary/secondary select functionality.
    // TODO: Tell user how many are selected.
    if (selected.map(selectedMs => selectedMs.id).includes(ms.id)) {
      handleDeselect()
    } else {
      onSelect(ms, event)
      setCurrentMediaState(ms)
    }
  }

  const handleSelectBreadcrumb = (filter: MediaStateFilter) => (
    selectedTIID: string
  ) => {
    setFilter({
      ...filter,
      treeFilter: selectedTIID === '' ? [] : [selectedTIID],
    })
  }

  return (
    <>
      {incomingAssetsRedirect ? (
        <Redirect push to={incomingAssetsRedirect} />
      ) : (
        <Box bg={theme.grayDarker} p={theme.s4} width='100%' overflow='scroll'>
          {currentFilter.treeFilter && currentFilter.treeFilter.length > 0 ? (
            <TreeBreadcrumb
              rootTd={rootTd}
              selectedTIID={currentFilter.treeFilter[0]}
              setSelectedTIID={handleSelectBreadcrumb(currentFilter)}
            />
          ) : (
            undefined
          )}
          {searchFilteredMS.length ? (
            <Grid zoom={assetsZoom}>
              {searchFilteredMS.map(ms => (
                <Route
                  key={ms.id}
                  render={({ history }) => (
                    <AssetButton
                      onClick={event => handleSelect(ms, event)}
                      onDoubleClick={() => {
                        if (project) {
                          history.push(`/project/${project.id}/single-asset`)
                          updatePerspectiveData({
                            id: 'assets',
                            data: { rhpTitle: 'Asset Details' },
                          })
                        }
                      }}
                    >
                      <Asset
                        showDetails
                        title={ms.name}
                        src={ms.thumbnail}
                        selected={selected.includes(ms)}
                      />
                    </AssetButton>
                  )}
                />
              ))}
            </Grid>
          ) : (
            <Box>
              <Text body color='white'>
                {searchQuery && searchQuery.length > 0 ? (
                  `No assets found for "${searchQuery}"`
                ) : (
                  <Flex align='center'>
                    <FileIcon size='small' color={theme.primary} format='404' />
                    No assets found.
                  </Flex>
                )}
              </Text>
            </Box>
          )}
        </Box>
      )}
    </>
  )
}
