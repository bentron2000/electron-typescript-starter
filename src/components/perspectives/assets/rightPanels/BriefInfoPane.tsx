import * as React from 'react'
import styled from 'styled-components'
import { Element } from '@models/Element'
import { TreeInstance } from '@models/TreeInstance'
import { Stage } from '@models/Stage'
import {
  Box,
  Button,
  Flex,
  Text,
  Subsection,
  Heading,
  StaticElementData,
  theme,
} from '@components/shared'

const SectionHeading = styled(Heading)`
  font-weight: 400;
  font-size: 18px;
`

const OpenInBriefContainer = styled(Flex)`
  border-top: ${theme.lightStroke};
`

interface IBriefInfoPane {
  elements: Element[]
  onOpenInBrief: (state?: { linkToIds?: string[] }) => void
  filteredTree: TreeInstance | undefined
  filteredStage: Stage | undefined
}

const FieldsetButton = styled(Button)`
  text-transform: none;
  letter-spacing: initial;
  font-size: 18px;
  font-weight: 400;
  width: 100%;
`

const BriefInfoFieldsetButton = ({
  name,
  onClick,
}: {
  name: string
  onClick: () => void
}) => (
  <Box p='4px'>
    <FieldsetButton
      text
      color='white'
      padding='12px'
      iconRight='more-right'
      contentFlexProps={{ flex: 1 }}
      onClick={onClick}
    >
      {name}
    </FieldsetButton>
  </Box>
)

const BriefInfoElementHeading = ({ name }: { name: string }) => (
  <Box p='12px'>
    <SectionHeading m='0' small>
      {name}
    </SectionHeading>
  </Box>
)

const BriefInfoElement = ({ element }: { element: Element }) => {
  return (
    <Box>
      <StaticElementData
        data={element.data[0]}
        readOnly={true}
        color={theme.grayLighter}
      />
    </Box>
  )
}

export const BriefInfoPane = ({
  elements,
  onOpenInBrief,
  filteredTree,
  filteredStage,
}: IBriefInfoPane) => {
  const filterInfoText = filteredTree
    ? filteredTree.name
    : filteredStage
    ? filteredStage.name
    : ''
  return (
    <Box width='100%' height='100%'>
      {filterInfoText && (
        <Flex align='center' p={theme.s3}>
          <Text mb='0' mt={theme.s2} subtitle color={theme.grayLight}>
            About '{filterInfoText}'
          </Text>
        </Flex>
      )}
      <Flex direction='column' height='100%' p={'0 4px 0 0'}>
        {elements.map(element =>
          element.isFieldSet ? (
            <BriefInfoFieldsetButton
              name={element.name}
              onClick={() => onOpenInBrief({ linkToIds: [element.id] })}
            />
          ) : (
            <Subsection
              key={element.id}
              minimal
              borderless
              expanded
              heading={<BriefInfoElementHeading name={element.name} />}
            >
              <BriefInfoElement element={element} />
            </Subsection>
          )
        )}
      </Flex>
      <OpenInBriefContainer align='center' justify='center' p={theme.s2}>
        <Button text color={theme.grayLight} onClick={() => onOpenInBrief()}>
          open in brief
        </Button>
      </OpenInBriefContainer>
    </Box>
  )
}
