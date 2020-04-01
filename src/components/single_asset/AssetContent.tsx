import * as React from 'react'
import { useStoreState } from '@redux/store'
import { Asset, Box } from '../shared'
import { theme } from '../shared/Theme/theme'

export interface AssetContent {}

export const AssetContent = () => {
  const ms = useStoreState(s => s.assetPerspective.mediaState.current)

  return (
    <Box
      overflow='scroll'
      width='100%'
      height='100%'
      bg={theme.grayDarker}
      p={theme.s3}>
      {ms ? <Asset src={ms.preview} /> : 'No Media State Found'}
    </Box>
  )
}
