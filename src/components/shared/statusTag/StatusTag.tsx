import * as React from 'react'
import styled from 'styled-components'
import { Text } from '../typography/Text'
import { theme } from '../Theme/theme'

const StatusTagContainer = styled.div`
  display: flex;
  align-items: center;
`

const StatusIcon = styled.div<{ color: string }>`
  height: 15px;
  width: 15px;
  background: ${props => props.color};
  border-radius: 50%;
  margin-right: 5px;
  margin-bottom: 1px;
`

interface StatusTag {
  status?: 'draft'
}

const colorMap = {
  draft: theme.orange,
}

export const StatusTag = ({ status = 'draft' }) => {
  return (
    <StatusTagContainer>
      <StatusIcon color={colorMap[status]} />
      <Text subtitle color={colorMap[status]} mb='0'>
        {status}
      </Text>
    </StatusTagContainer>
  )
}
