import * as React from 'react'
import styled, { css } from 'styled-components'
import { PopOver, Flex, Box, Icon, Button } from '@components/shared'
import { Text } from '@components/shared/typography/Text'
import { theme } from '@components/shared/Theme/theme'
import { Stage } from '@models/Stage'
import { typePicker } from '@helpers/typePicker'

const StyledStageListItem = styled(Flex)`
  box-sizing: border-box;
  width: 100%;
  padding: ${theme.s2};
  cursor: pointer;

  &:hover {
    background: ${theme.grayLightest};
  }
`

const StageTypeIcon = styled(Icon)<{ color: string }>`
  color: ${props => props.color};
`

const StyledButton = styled(Button)<{ typeColor: string }>`
  background: ${theme.elementLightGrey};
  border-radius: 30px;
  text-transform: capitalize;
  font-size: 18px;
  min-width: 200px;
  max-width: 250px;

  ${props =>
    css`
      border: 2px solid ${props.typeColor};
      color: ${props.typeColor};
    `}
`

const ButtonContent = styled.span`
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TextContainer = styled(Flex)`
  min-width: 0;
`

export interface IStageSelector {
  stages: Stage[]
  selected: Stage
  onSelect: (stage: Stage) => void
}

interface IStageListItem extends Pick<IStageSelector, 'onSelect'> {
  stage: Stage
}

const StageListItem = ({ stage, onSelect }: IStageListItem) => {
  const type = typePicker(stage.type)
  return (
    <StyledStageListItem onClick={() => onSelect(stage)}>
      <Flex flex={0}>
        <StageTypeIcon width='32px' name={type.icon} color={type.color} />
      </Flex>
      <TextContainer width='100%' align='center'>
        <Text ellipsis body m='2px 0 0 6px' color={theme.textDark}>
          {stage.name}
        </Text>
      </TextContainer>
    </StyledStageListItem>
  )
}

const StageButton = ({ stage }: { stage: Stage }) => {
  const stageType = typePicker(stage.type)
  return (
    <StyledButton
      typeColor={stageType.color}
      contentFlexProps={{ justify: 'flex-start' }}
      iconLeft={
        <Flex mr={theme.s2} flex={0}>
          <StageTypeIcon
            width='28px'
            name={stageType.icon}
            color={stageType.color}
          />
        </Flex>
      }
      iconRight={
        <Flex mr={theme.s2} flex={0}>
          <Icon name='chevron' width='20px' />
        </Flex>
      }
    >
      <ButtonContent>{stage.name}</ButtonContent>
    </StyledButton>
  )
}

export const StageSelector = ({
  stages,
  selected,
  onSelect,
}: IStageSelector) => {
  return (
    <PopOver
      below
      closeOnContentClick
      width='300px'
      content={
        <Box width='100%'>
          <Flex direction='column' align='center'>
            {stages.map(stage => (
              <StageListItem key={stage.id} stage={stage} onSelect={onSelect} />
            ))}
          </Flex>
        </Box>
      }
    >
      <Box>
        <StageButton stage={selected} />
      </Box>
    </PopOver>
  )
}
