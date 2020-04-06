import * as React from 'react'
import styled from 'styled-components'
import { Element, buildElement } from '@models/Element'

import { theme } from '@components/shared/Theme/theme'
import { AddButton, Icon, Text, Flex } from '@components/shared'
import { BriefAddContentPanel, DisplaySection } from '.'

const PopOverContentIcon = styled(Icon)`
  color: #858890;
`

const PopOverContentColumn = styled(Flex)`
  padding: 15px 30px;
  min-width: 240px;
`

const PopOverColumnLineBreak = styled(Flex)`
  border-left: 1px solid ${theme.grayLightest};
  margin: 20px 0;
`

const PopOverContentText = styled(Text)`
  font-size: 18px;
  font-weight: 500;
`

const PopOverContentAddButton = styled(AddButton)`
  :hover {
    color: ${theme.yellow};
  }
`

interface AddElementPopOver extends Pick<DisplaySection, 'section'> {
  createElement: (element: Element) => void
  addContentPanelMinHeight?: string
}

export interface AddElementPopOverContent extends AddElementPopOver {
  // BriefAddContentPanel clones the AddElementPopOverContent component, applying
  // this closeTooltip callback to props.
  closeTooltip?: () => void
}

const AddElementPopOverContent = (props: AddElementPopOverContent) => {
  const handleClick = (isFieldSet = false) => {
    props.createElement(
      buildElement({
        name: 'New Element',
        sectionId: props.section.id,
        isFieldSet,
      })
    )
    if (props.closeTooltip) {
      props.closeTooltip()
    }
  }
  return (
    <Flex>
      <PopOverContentColumn direction='column' align='center' justify='center'>
        <PopOverContentIcon name='static-element' width='100px' />
        <PopOverContentText body mb='15px' color={theme.textDark}>
          Add Static Element
        </PopOverContentText>
        <Text small mb='10px' color={theme.textLight}>
          These contain text blocks, images, and other general brief
          information.
        </Text>
        <PopOverContentAddButton onClick={() => handleClick()}>
          add template...
        </PopOverContentAddButton>
      </PopOverContentColumn>
      <PopOverColumnLineBreak />
      <PopOverContentColumn direction='column' align='center' justify='center'>
        <PopOverContentIcon name='fieldset-element' width='100px' />
        <PopOverContentText body mb='15px' color={theme.textDark}>
          Add Fieldset Element
        </PopOverContentText>
        <Text small mb='10px' color={theme.textLight}>
          These contain specific per-asset information, such as metadata fields.
        </Text>
        <PopOverContentAddButton onClick={() => handleClick(true)}>
          add template...
        </PopOverContentAddButton>
      </PopOverContentColumn>
    </Flex>
  )
}

export const AddElementPopOver = (props: AddElementPopOver) => {
  return (
    <BriefAddContentPanel
      minHeight={props.addContentPanelMinHeight}
      text='add element'
      tooltipContent={<AddElementPopOverContent {...props} />}
    />
  )
}
