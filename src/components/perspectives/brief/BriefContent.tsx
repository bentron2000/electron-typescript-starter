import * as React from 'react'
import pluralize from 'pluralize'

import { Section, buildSection } from '@models/Section'
import { LoupeRealmErrorResponse } from '@models/ipc'

import { Box, Heading, TreeBreadcrumb } from '@components/shared'
import { useToasts } from '@components/shared/toast/ToastProvider'
import { theme } from '@components/shared/Theme/theme'
import { DisplaySection, BriefAddContentPanel } from '.'

import { useStoreState, useStoreActions } from '@redux/store'
import { BriefFilter } from '@redux/state'

const CreateToastContent = ({ stagesCount }: { stagesCount: number }) => {
  return (
    <>
      Section created and visible on{' '}
      <strong>
        {stagesCount} workflow {pluralize('stages', stagesCount)}
      </strong>
      .
    </>
  )
}

export interface BriefContent {}

export const BriefContent = React.forwardRef(
  (_props: BriefContent, ref: React.RefObject<HTMLDivElement>) => {
    const rootTd = useStoreState(s => s.project.tree.rootTD)
    const briefFilter = useStoreState(s => s.briefPerspective.filter.current)
    const sections = useStoreState(s => s.briefPerspective.filteredBriefs)
    const selectedSection = useStoreState(
      s => s.briefPerspective.section.current
    )
    const selectSection = useStoreActions(a => a.briefPerspective.section.set)
    const getSectionIndex = useStoreState(
      s => s.briefPerspective.section.getIndex
    )
    const setBriefFilter = useStoreActions(a => a.briefPerspective.filter.set)
    const createSection = useStoreActions(
      a => a.briefPerspective.section.create
    )
    const clearElement = useStoreActions(a => a.briefPerspective.element.clear)
    const updatePerspectiveData = useStoreActions(
      a => a.app.updatePerspectiveData
    )
    const setStageRelRhpState = useStoreActions(
      a => a.briefPerspective.rhp.setStageRelevance
    )
    const { addToast } = useToasts()

    const handleCreateSection = (positionIndex: number) => {
      const params = {
        section: buildSection({ name: 'New Section' }),
        positionIndex,
      }
      createSection(params)
        .then(({ data: section }) => {
          addToast(<CreateToastContent stagesCount={section.stageIds.length} />)
        })
        .catch((err: LoupeRealmErrorResponse) =>
          addToast(err.message, { type: 'negative' })
        )
    }

    const handleSectionClick = (section: Section) => {
      selectSection(section)
      clearElement()
      updatePerspectiveData({ id: 'brief', data: { rhpTitle: section.name } })
      setStageRelRhpState({ expand: true })
    }

    const handleSelectBreadcrumb = (currentFilter: BriefFilter) => (
      selectedTIID: string
    ) => {
      setBriefFilter({
        ...currentFilter,
        treeFilter: selectedTIID === '' ? [] : [selectedTIID],
      })
    }

    return (
      <>
        <Box
          refNode={ref}
          bg={theme.grayDarker}
          p={theme.s4}
          overflow='auto'
          width={'100%'}
        >
          <TreeBreadcrumb
            rootTd={rootTd}
            selectedTIID={briefFilter.treeFilter[0]}
            setSelectedTIID={handleSelectBreadcrumb(briefFilter)}
          />
          <Heading large color={theme.grayLight} mb='0'>
            Project Brief
          </Heading>
          <BriefAddContentPanel
            text='add section'
            minHeight='24px'
            onClick={() => handleCreateSection(0)}
          />
          {sections.length && rootTd ? (
            sections.map(section => (
              <React.Fragment key={section.id}>
                <DisplaySection
                  rootTd={rootTd}
                  section={section}
                  onClick={() => handleSectionClick(section)}
                  selected={
                    selectedSection && selectedSection.id === section.id
                  }
                />
                <BriefAddContentPanel
                  text='add section'
                  minHeight='24px'
                  onClick={() =>
                    handleCreateSection(getSectionIndex(section.id) + 1)
                  }
                />
              </React.Fragment>
            ))
          ) : (
            <Heading medium>No Sections</Heading>
          )}
        </Box>
      </>
    )
  }
)
