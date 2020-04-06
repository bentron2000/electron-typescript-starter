import * as React from 'react'
import { without } from 'ramda'

import { Stage } from '@models/Stage'
import { BriefFilter } from '@redux/state'

import { Lozenge, Box } from '@components/shared'
import { theme } from '@components/shared/Theme/theme'

interface StageFilterPane {
  stages: Stage[]
  filter: BriefFilter
  setFilter: (filter: BriefFilter) => void
}

export const StageFilterPane = (props: StageFilterPane) => {
  const setActive = (id: string) =>
    props.filter.stageFilter.includes(id)
      ? props.setFilter({
          ...props.filter,
          stageFilter: without([id], props.filter.stageFilter),
        })
      : props.setFilter({
          ...props.filter,
          stageFilter: [...props.filter.stageFilter, id],
        })

  return (
    <Box p={theme.s3}>
      {props.stages.map(stage => (
        <Lozenge
          key={stage.id}
          checkId={stage.id}
          onChange={() => setActive(stage.id)}
          isChecked={props.filter.stageFilter.includes(stage.id)}
        >
          {stage.name}
        </Lozenge>
      ))}
    </Box>
  )
}
