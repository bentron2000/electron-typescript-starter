import * as React from 'react'
import styled, { css } from 'styled-components'
import pluralize from 'pluralize'
import { v4 as uuid } from 'uuid'

import { useStoreActions } from '@redux/store'
import { Element } from '@models/Element'
import { TreeDefinition, tDfindById } from '@models/TreeDefinition'
import { LoupeRealmErrorResponse } from '@models/ipc'

import {
  Collapsible,
  Box,
  PopOver,
  Button,
  RelevanceLabel,
  Flex,
  Text,
  StaticElementData,
} from '@components/shared'
import { theme } from '@components/shared/Theme/theme'
import { useDeepLink } from '@components/shared/deepLink/DeepLinkProvider'
import { useToasts } from '@components/shared/toast/ToastProvider'
import { AddInputPopOver } from './AddInputPopOver'
import { DisplayFieldset } from './DisplayFieldset'

const ElementCollapsible = styled(Collapsible)`
  margin-bottom: 0;
`
const ElementContainer = styled.div<Pick<DisplayElement, 'selected'>>`
  border-radius: 5px;
  :hover {
    border: 1px solid ${theme.primaryLight};
    margin: -1px;
  }
  ${props =>
    props.selected &&
    css`
      border: 1px solid ${theme.primary};
      margin: -1px;
      :hover {
        border: 1px solid ${theme.primary};
        margin: -1px;
      }
    `}
`
export interface DisplayElement {
  rootTd: TreeDefinition
  element: Element
  selected?: boolean
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
}

const DuplicateElementToastContent = ({ tisCount }: { tisCount: number }) => {
  return (
    <>
      Element duplicated and related to{' '}
      <strong>
        {tisCount} tree {pluralize('instances', tisCount)}
      </strong>
      .
    </>
  )
}

export const DisplayElement = ({
  rootTd,
  element,
  selected,
  onClick,
}: DisplayElement) => {
  const { addToast } = useToasts()
  const { link } = useDeepLink()
  const ref = React.useRef<HTMLDivElement>(null)
  const createElement = useStoreActions(a => a.briefPerspective.element.create)
  const updateElement = useStoreActions(a => a.briefPerspective.element.update)
  const deleteElement = useStoreActions(a => a.briefPerspective.element.delete)
  const updateElementData = useStoreActions(
    a => a.briefPerspective.element.updateElementData
  )
  const setRightPanelTitle = useStoreActions(a => a.app.setRightPanelTitle)

  const [showHoverControls, setShowHoverControls] = React.useState(false)

  const relevantTD =
    element.treeDefinitionRelevanceId && rootTd
      ? tDfindById(rootTd, element.treeDefinitionRelevanceId)[0]
      : undefined

  const staticSubtitle = element.isFieldSet
    ? 'Fieldset Element'
    : 'Static Element'

  // Temporary
  // TODO: persist & update EP state
  const [elementData, setElementData] = React.useState(element.data)
  const handleAddInput = (input: any, positionIndex: number) => {
    const tmp = [...elementData]
    tmp.splice(positionIndex, 0, {
      id: uuid(),
      model: 'ElementData',
      name: `This could be a ${input.label}`,
      value: `${input.value}`,
      fields: [],
      treeInstanceIds: [],
      elementId: '',
    })
    setElementData(tmp)
  }
  // end temporary

  // TODO: add check to only attach this function if the user is allowed to edit the heading
  const saveElementName = (newName: string) => {
    setRightPanelTitle(newName)
    updateElement({ ...element, name: newName }).catch(
      (err: LoupeRealmErrorResponse) => {
        addToast(err.message, { type: 'negative' })
      }
    )
  }

  const handleDuplicateElement = () => {
    createElement({ element })
      .then(({ data: el }: { data: Element }) => {
        addToast(
          <DuplicateElementToastContent
            tisCount={el.treeInstanceRelevanceIds.length}
          />
        )
      })
      .catch((err: LoupeRealmErrorResponse) => {
        addToast(err.message, { type: 'negative' })
      })
  }

  const handleDeleteElement = () => {
    deleteElement(element.id)
      .then(() => addToast(`"${element.name}" element deleted`))
      .catch((err: LoupeRealmErrorResponse) => {
        addToast(err.message, { type: 'negative' })
      })
  }

  React.useEffect(() => {
    if (ref.current) {
      link(element.id, ref.current)
      // Triggers the onClick actions which selects the element (fakes a MouseEvent..)
      if (onClick) {
        onClick({ stopPropagation: () => undefined } as React.MouseEvent<
          HTMLElement
        >)
      }
    }
  }, [ref.current])

  return (
    <ElementContainer
      ref={ref}
      selected={selected}
      onMouseEnter={() => setShowHoverControls(true)}
      onMouseLeave={() => setShowHoverControls(false)}
    >
      <ElementCollapsible
        heading={element.name}
        key={element.id}
        subtitle={
          <Box p={`0 ${theme.s2}`}>
            {element.treeInstanceRelevanceIds.length ? (
              <RelevanceLabel element={element} rootTd={rootTd} />
            ) : (
              <Text color={theme.grayLight} ml={theme.s2} mb='0' subtitle>
                {staticSubtitle}
              </Text>
            )}
          </Box>
        }
        bg={theme.elementGrey}
        saveHeading={saveElementName}
        onClick={onClick}
        controls={
          <Flex align='center'>
            {showHoverControls && (
              <>
                <Button
                  padding='0'
                  icon='duplicate'
                  hoverColor='white'
                  color={theme.grayLight}
                  onClick={handleDuplicateElement}
                />
                <PopOver
                  width='200px'
                  content={
                    <>
                      <Button text color={'red'} onClick={handleDeleteElement}>
                        Delete Element
                      </Button>
                    </>
                  }
                >
                  <Button
                    icon='more'
                    color={theme.grayLighter}
                    padding={theme.s2}
                    hoverColor='white'
                  />
                </PopOver>
              </>
            )}
          </Flex>
        }
      >
        {element.isFieldSet ? (
          <DisplayFieldset element={element} td={relevantTD} />
        ) : (
          <>
            <AddInputPopOver createInput={input => handleAddInput(input, 0)} />
            {elementData.map((data, index) => (
              <React.Fragment key={data.id}>
                <StaticElementData
                  data={data}
                  updateElementData={updateElementData}
                  border={`1px solid ${theme.grayDark}`}
                />
                <AddInputPopOver
                  createInput={input => handleAddInput(input, index + 1)}
                />
              </React.Fragment>
            ))}
          </>
        )}
      </ElementCollapsible>
    </ElementContainer>
  )
}
