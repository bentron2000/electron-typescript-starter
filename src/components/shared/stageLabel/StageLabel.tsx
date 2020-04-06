import * as React from 'react'
import { Stage } from '@models/Stage'
import { Section } from '@models/Section'
import { Text, PopOver, Flex } from '@components/shared'
import { theme } from '@components/shared/Theme/theme'
import pluralize from 'pluralize'
import styled from 'styled-components'

const PopOverContentList = styled.ul`
  margin: 0;
  padding: 10px 15px;
  width: max-content;

  li {
    list-style: none;
  }
`

const Label = (props: { children: any }) => (
  <Text subtitle mb='0' color={theme.grayLighter} {...props} />
)

const PopOverContent = ({ names }: { names: string[] }) => (
  <Flex direction='column'>
    <PopOverContentList>
      {names.map((n, i) => (
        <li key={`${n}${i}`}>
          <Label>{n} Stage</Label>
        </li>
      ))}
    </PopOverContentList>
  </Flex>
)

interface StageLabel {
  section: Section
  stages: Stage[]
  manyAsPopover?: boolean
}

// Note: This component should received filtered stages (stages the sections is related too)...
// This is not done here as it may need to involved computed state, or else risk stale relationships.
export const StageLabel = (props: StageLabel) => {
  const names = props.stages.map(stage => stage.name)
  const content = names.join(', ') + ' ' + pluralize('stages', names.length)
  return props.manyAsPopover && names.length > 1 ? (
    <PopOver below content={<PopOverContent names={names} />}>
      <Label>
        {names.length} {pluralize('stages', names.length)}
      </Label>
    </PopOver>
  ) : (
    <Label>{content}</Label>
  )
}
