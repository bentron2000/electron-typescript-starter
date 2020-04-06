import * as React from 'react'

import { MediaState } from '@models/MediaState'

import { Box, Text, Flex } from '@components/shared'
import { theme } from '@components/shared/Theme/theme'

export interface MetadataPane {
  currentMediaState: MediaState | undefined
}

export const MetadataPane = (props: MetadataPane) => (
  <Flex direction='column'>
    <Box p={theme.s3} bb={`1px solid ${theme.grayDark}`}>
      <Flex direction='row' justify='space-between' align='center'>
        <Text mb='0' subtitle color={theme.grayLight}>
          State ID
        </Text>
        <Text align='right' mb='0' body color={theme.grayLight}>
          {props.currentMediaState ? props.currentMediaState.id : ''}
        </Text>
      </Flex>
    </Box>
    <Box p={theme.s3} bb={`1px solid ${theme.grayDark}`}>
      <Flex direction='row' justify='space-between' align='center'>
        <Text mb='0' subtitle color={theme.grayLight}>
          Stage ID
        </Text>
        <Text align='right' mb='0' body color={theme.grayLight}>
          {props.currentMediaState ? props.currentMediaState.stageId : ''}
        </Text>
      </Flex>
    </Box>
    <Box p={theme.s3} bb={theme.grayLight}>
      <Flex direction='row' justify='space-between' align='center'>
        <Text mb='0' subtitle color={theme.grayLight}>
          Asset ID
        </Text>
        <Text align='right' mb='0' body color={theme.grayLight}>
          {props.currentMediaState ? props.currentMediaState.assetId : ''}
        </Text>
      </Flex>
    </Box>
  </Flex>
)
