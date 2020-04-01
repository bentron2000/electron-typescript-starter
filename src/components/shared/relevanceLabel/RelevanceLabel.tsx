import * as React from 'react'
import styled from 'styled-components'
import { Flex, Icon, Text } from '..'
import { theme } from '../Theme/theme'
import { RelevanceMessage, IRelevanceMessage } from '.'

const TreeIcon = styled(Icon)`
  color: ${theme.grayLighter};
  padding-right: 5px;
`

const LabelText = styled(Text)`
  > span {
    color: white;
  }
`

interface RelevanceLabel extends Partial<IRelevanceMessage> {
  children?: React.ReactChild
}

// If given IRelevanceMessage props, renders RelevanceMessage as apart of RelevanceLabel.
// Otherwise, this component can be usered for custom labels with the TreeIcon and labelTest
// styling.
export const RelevanceLabel = ({ children, ...props }: RelevanceLabel) => {
  const [hasRelevance, setHasRelevance] = React.useState(true)

  const handleRelevanceResult = (result: string) => {
    setHasRelevance(Boolean(result))
  }

  return (
    <Flex align='center'>
      {hasRelevance && <TreeIcon name='tree' width='24px' />}
      <LabelText small ellipsis mb='0' color={theme.grayLight}>
        {props.element && props.rootTd
          ? <RelevanceMessage resultCb={handleRelevanceResult} {...props as IRelevanceMessage} />
          : children
        }
      </LabelText>
    </Flex>
  )
}
