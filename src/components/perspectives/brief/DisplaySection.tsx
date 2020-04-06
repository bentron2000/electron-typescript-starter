import * as React from 'react'
import styled, { css } from 'styled-components'
import pluralize from 'pluralize'

import { Section } from '@models/Section'
import { Element } from '@models/Element'
import { TreeDefinition } from '@models/TreeDefinition'

import { LoupeRealmErrorResponse } from '@models/ipc'
import { useStoreState, useStoreActions } from '@redux/store'

import { theme } from '@components/shared/Theme/theme'
import {
  Collapsible,
  Flex,
  Box,
  StageLabel,
  Icon,
  Button,
  StatusTag,
  PopOver,
} from '@components/shared'
import { DisplayElement, AddElementPopOver } from '.'
import { useToasts } from '@components/shared/toast/ToastProvider'

const SectionContainer = styled.div<Pick<DisplaySection, 'selected'>>`
  border-radius: 5px;
  :hover {
    margin: -1px;
    border: 1px solid ${theme.primaryLight};
  }
  ${props =>
    props.selected &&
    css`
      margin: -1px;
      border: 1px solid ${theme.primary};
      :hover {
        border: 1px solid ${theme.primary};
        margin: -1px;
      }
    `}
`

const SectionCollapsible = styled(Collapsible)`
  /* add content button rows when hidden render an empty hoverable bar. This creates the spacing
  between the elements */
  margin-bottom: 0;
`

const DuplicateSectionToastContent = ({
  stagesCount,
}: {
  stagesCount: number
}) => {
  return (
    <>
      Section duplicated and visible on{' '}
      <strong>
        {stagesCount} workflow {pluralize('stages', stagesCount)}
      </strong>
      .
    </>
  )
}

const CreateElementToastContent = ({ tisCount }: { tisCount: number }) => {
  return (
    <>
      Element created and related to{' '}
      <strong>
        {tisCount} tree {pluralize('instances', tisCount)}
      </strong>
      .
    </>
  )
}

export interface DisplaySection {
  rootTd: TreeDefinition
  section: Section
  selected?: boolean
  onClick?: () => void
}

export const DisplaySection = ({
  section,
  rootTd,
  selected,
  onClick,
}: DisplaySection) => {
  const { addToast } = useToasts()
  const createSection = useStoreActions(
    actions => actions.briefPerspective.section.create
  )
  const updateSection = useStoreActions(a => a.briefPerspective.section.update)
  const deleteSection = useStoreActions(a => a.briefPerspective.section.delete)
  const sectionStages = useStoreState(s => s.project.briefs.sectionStages)
  const createElement = useStoreActions(a => a.briefPerspective.element.create)
  const selectElement = useStoreActions(a => a.briefPerspective.element.set)
  const selectedElement = useStoreState(s => s.briefPerspective.element.current)
  const updatePerspectiveData = useStoreActions(
    a => a.app.updatePerspectiveData
  )
  const clearSection = useStoreActions(a => a.briefPerspective.section.clear)
  const setElRelevanceRhpState = useStoreActions(
    a => a.briefPerspective.rhp.setElementRelevance
  )

  const [showHoverControls, setShowHoverControls] = React.useState(false)
  const stages = sectionStages(section)

  const handleElementClick = (
    element: Element,
    e: React.MouseEvent<HTMLElement>
  ) => {
    e.stopPropagation()
    selectElement(element)
    updatePerspectiveData({ id: 'brief', data: { rhpTitle: element.name } })
    setElRelevanceRhpState({ expand: true })
    clearSection()
  }

  const saveSectionName = (name: string) => {
    updatePerspectiveData({ id: 'brief', data: { rhpTitle: name } })
    return updateSection({ ...section, name })
  }

  const handleDuplicateSection = () => {
    createSection({ section })
      .then(() => {
        addToast(
          <DuplicateSectionToastContent stagesCount={section.stageIds.length} />
        )
      })
      .catch((err: LoupeRealmErrorResponse) =>
        addToast(err.message, { type: 'negative' })
      )
  }

  const handleCreateElement = (element: Element, positionIndex = 0) => {
    createElement({ element, positionIndex })
      .then(({ data: el }: { data: Element }) => {
        addToast(
          <CreateElementToastContent
            tisCount={el.treeInstanceRelevanceIds.length}
          />
        )
      })
      .catch((err: LoupeRealmErrorResponse) =>
        addToast(err.message, { type: 'negative' })
      )
  }

  const handleDeleteSection = () => {
    deleteSection(section.id)
      .then(() => addToast(`"${section.name}" section deleted`))
      .catch((err: LoupeRealmErrorResponse) =>
        addToast(err.message, { type: 'negative' })
      )
  }

  return (
    <SectionContainer
      selected={selected}
      onMouseEnter={() => setShowHoverControls(true)}
      onMouseLeave={() => setShowHoverControls(false)}
    >
      <SectionCollapsible
        heading={section.name}
        headingControls={!stages.length && <StatusTag />}
        key={section.id}
        subtitle={
          !!stages.length && (
            <Box p={`0 ${theme.s2}`}>
              <Flex align='center'>
                <Box height='24px' mr={theme.s2}>
                  <Icon name='eye' width='24px' fill={theme.grayLighter} />
                </Box>
                <StageLabel manyAsPopover section={section} stages={stages} />
              </Flex>
            </Box>
          )
        }
        controls={
          <Flex align='center'>
            {showHoverControls && (
              <>
                <Button
                  padding='0'
                  icon='duplicate'
                  hoverColor='white'
                  color={theme.grayLight}
                  onClick={handleDuplicateSection}
                />
                <PopOver
                  width='200px'
                  content={
                    <>
                      <Button text color={'red'} onClick={handleDeleteSection}>
                        Delete Section
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
        bg={theme.sectionGrey}
        saveHeading={saveSectionName}
        onClick={onClick}
        saveOnEnter
        showEditableControls
      >
        <AddElementPopOver
          section={section}
          createElement={handleCreateElement}
        />
        {section.elements.map((element, index) => (
          <React.Fragment key={element.id}>
            <DisplayElement
              rootTd={rootTd}
              element={element}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                handleElementClick(element, e)
              }}
              selected={selectedElement && selectedElement.id === element.id}
            />
            <AddElementPopOver
              section={section}
              createElement={e => handleCreateElement(e, index + 1)}
            />
          </React.Fragment>
        ))}
      </SectionCollapsible>
    </SectionContainer>
  )
}
