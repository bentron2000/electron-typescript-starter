import * as React from 'react'
import { darken } from 'polished'
import styled, { css } from 'styled-components'
import {
  StageContainer,
  TransContainer,
  TransAdd,
  IconContainer,
} from './DiagramContainers'
import { typePicker, StageType } from '@helpers/typePicker'
import { Stage } from '@models'
import {
  Flex,
  Icon,
  theme,
  Input,
  Button,
  InlineEdit2,
  InlineEdit2ReadView,
  IInlineEdit2,
} from '@components/shared'

const ContentContainer = styled(Flex)`
  overflow: hidden;
`

// The non-draggable elements need to have a `data-is-editable` attribute set to true
const StageNodeReadView = styled(InlineEdit2ReadView).attrs({
  'data-is-editable': true,
})``

const StageNodeEditableInput = styled(Input).attrs({
  'data-is-editable': true,
})<{ type: StageType }>`
  width: 100%;
  font-style: italic;
  :focus {
    background-color: ${props => darken(0.1, props.type.color)};
    border: ${`1px solid ${theme.primary}`};
    outline: none;
    margin: -1px;
  }
`

const NodeInlineEdit = styled(InlineEdit2)<
  IInlineEdit2 & { width: number; hover: boolean }
>`
  ${({ hover, width }) => css`
    width: ${hover ? `${width * 0.48}px` : '100%'};
    margin: ${`${theme.s2} 0 ${theme.s2} ${theme.s2}`};
  `}
`

interface DiagramNode {
  id: string
  selected: boolean
  hover: boolean
  linked: boolean
  data: any
  props: any
  onUpdateStage: (stage: Stage) => void
  onDuplicateStage: (stage: Stage) => void
  onDeleteStage: (stage: Stage) => void
  toggleEditView?: boolean
}

const AutomatedStageNode = (props: any) => {
  return (
    <g {...props}>
      <use {...props} className='node' />
    </g>
  )
}

// IMPORTANT: This component is memoized! See bottom of file at export.
const DiagramNode = ({
  selected,
  hover,
  linked,
  data,
  props,
  onUpdateStage,
  onDuplicateStage,
  onDeleteStage,
  toggleEditView = false,
}: DiagramNode) => {
  // This class is configured as the nodeEdgeHandleSelector prop of the GraphView component.
  const nodeEdgeHandleClass = 'create-edge-handle'

  const handleUpdateTitle = (newName: string) => {
    onUpdateStage({ ...data.loupeData, name: newName })
  }

  const handleDuplicate = () => {
    onDuplicateStage(data.loupeData)
  }

  const handleDelete = () => {
    onDeleteStage(data.loupeData)
  }

  const type = typePicker(data.title)
  const stageElementsProps = { selected, hover, linked, color: type.color }

  return data.type === 'custom' ? (
    <foreignObject {...props}>
      <StageContainer {...stageElementsProps}>
        {hover && (
          <>
            <TransContainer
              left
              color={type.color}
              data-is-editable={true}
              className={nodeEdgeHandleClass}
            >
              <TransAdd left color={type.color}>
                <span>+</span>
              </TransAdd>
            </TransContainer>
            <TransContainer
              right
              color={type.color}
              data-is-editable={true}
              className={nodeEdgeHandleClass}
            >
              <TransAdd right color={type.color}>
                <span>+</span>
              </TransAdd>
            </TransContainer>
          </>
        )}
        <IconContainer color={type.color}>
          <Icon width='28px' name={type.icon} />
        </IconContainer>
        <ContentContainer p={hover ? '0' : `0 ${theme.s3} 0 0`} width='100%'>
          <NodeInlineEdit
            doubleClickToEdit
            hover={hover}
            toggleEditView={toggleEditView}
            width={props.width}
            value={data.title}
            readView={readProps => <StageNodeReadView {...readProps} />}
            editView={editProps => (
              <StageNodeEditableInput {...{ ...editProps, type }} />
            )}
            onSave={handleUpdateTitle}
          />
          {hover && (
            <Flex ml='4px' mr='4px'>
              <Button
                data-is-editable={true}
                padding='0'
                mr='2px'
                icon='duplicate'
                hoverColor='white'
                color={theme.grayLight}
                onClick={handleDuplicate}
              />
              <Button
                data-is-editable={true}
                padding='0'
                mr='2px'
                icon='close'
                hoverColor='white'
                color={theme.grayLight}
                onClick={handleDelete}
              />
            </Flex>
          )}
        </ContentContainer>
      </StageContainer>
    </foreignObject>
  ) : (
    <AutomatedStageNode {...{ ...props, className: `shape ${data.type}` }} />
  )
}

function arePropsEqual(prevProps: DiagramNode, nextProps: DiagramNode) {
  return (
    prevProps.data.title === nextProps.data.title &&
    prevProps.selected === nextProps.selected &&
    prevProps.linked === nextProps.linked &&
    prevProps.hover === nextProps.hover
  )
}

// Memoized DiagramNode component
// The diagram `renderNode` callback is invoked many times for all the nodes, causing lots of re-
// renders.
export default React.memo(DiagramNode, arePropsEqual)
