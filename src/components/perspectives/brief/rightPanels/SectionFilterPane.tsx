import * as React from 'react'
import { without } from 'ramda'

import { BriefFilter } from '@redux/state'
import { Section } from '@models/Section'

import { Lozenge, Box } from '@components/shared'
import { theme } from '@components/shared/Theme/theme'

export interface SectionFilterPane {
  sections: Section[]
  filter: BriefFilter
  setFilter: (filter: BriefFilter) => void
}

export const SectionFilterPane = (props: SectionFilterPane) => {
  const activeFilters = props.filter.sectionFilter

  const setActive = (id: string) =>
    activeFilters.includes(id)
      ? props.setFilter({
          ...props.filter,
          sectionFilter: without([id], activeFilters),
          stageFilter: props.filter.stageFilter,
        })
      : props.setFilter({
          ...props.filter,
          sectionFilter: [...activeFilters, id],
          stageFilter: props.filter.stageFilter,
        })

  return (
    <Box p={theme.s3}>
      {props.sections.map(section => (
        <Lozenge
          key={section.id}
          checkId={section.id}
          onChange={() => setActive(section.id)}
          isChecked={activeFilters.includes(section.id)}
        >
          {section.name}
        </Lozenge>
      ))}
    </Box>
  )
}
