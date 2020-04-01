import * as React from 'react'
import { all, any, union } from 'ramda'

import { Stage, Section } from '@models'
import { LoupeRealmErrorResponse, LoupeRealmResponse } from '@models/ipc'
import { useStateLockedByPromise } from '@components/helpers'
import { useToasts } from '@components/shared/toast/ToastProvider'
import {
  Flex,
  Text,
  Input,
  Box,
  BoxCheckbox,
  CheckboxList,
  CheckboxListChildProps,
} from '@components/shared'
import { theme } from '../../../shared/Theme/theme'

const isStageAttributed = (sectionStages: Stage[], stageId: string) => {
  return Boolean(
    sectionStages.find(attributedStage => attributedStage.id === stageId)
  )
}

interface StageItem
  extends CheckboxListChildProps,
    Pick<BriefStagesPane, 'section' | 'sectionStages' | 'updateSection'> {
  stage: Stage
}

const StageItem = ({
  stage,
  section,
  updateSection,
  sectionStages,
  ...props
}: StageItem) => {
  const { addToast } = useToasts()
  const stages = sectionStages(section)
  const sectionStageIds = stages.map(s => s.id)
  const isAttributed = isStageAttributed(stages, stage.id)
  const [checked, locked, setChecked] = useStateLockedByPromise(isAttributed)

  const handleChecked = () => {
    if (locked) {
      return
    }

    const newChecked = !checked
    section.stageIds = newChecked
      ? [...sectionStageIds, stage.id]
      : sectionStageIds.filter(id => id !== stage.id)
    const promise = updateSection(section)
    setChecked(newChecked, promise) // Eagerly set state
    promise.catch((err: LoupeRealmErrorResponse) => {
      setChecked(!newChecked) // Restore state
      addToast(err.message, { type: 'negative' })
    })
  }

  React.useEffect(() => setChecked(isAttributed), [section, stages])

  return (
    <BoxCheckbox checked={checked} onChange={handleChecked} {...props}>
      {stage.name}
    </BoxCheckbox>
  )
}

interface BriefStagesPane {
  stages: Stage[]
  section: Section
  sectionStages: (section: Section) => Stage[]
  updateSection: (payload: Section) => Promise<LoupeRealmResponse>
}

export const BriefStagesPane = ({
  stages,
  section,
  ...props
}: BriefStagesPane) => {
  const { addToast } = useToasts()
  const [search, setSearch] = React.useState('')
  const [filteredStages, setFilteredStages] = React.useState(stages)
  const isAllChecked = () =>
    all(
      stage => isStageAttributed(props.sectionStages(section), stage.id),
      filteredStages
    )
  const isSomeChecked = () =>
    any(
      stage => isStageAttributed(props.sectionStages(section), stage.id),
      filteredStages
    )
  const [allChecked, locked, setAllChecked] = useStateLockedByPromise(
    isAllChecked()
  )

  const handleAllChecked = (newAllChecked: boolean) => {
    if (locked) {
      return
    }

    const ids = filteredStages.map(s => s.id)
    section.stageIds = newAllChecked
      ? union(section.stageIds, ids)
      : section.stageIds.filter(id => !ids.includes(id))
    const promise = props.updateSection(section)
    setAllChecked(newAllChecked, promise)
    promise.catch((err: LoupeRealmErrorResponse) => {
      setAllChecked(!newAllChecked)
      addToast(err.message, { type: 'negative' })
    })
  }

  React.useEffect(() => {
    const filtered = search
      ? stages.filter(s => s.name.toLowerCase().includes(search))
      : stages
    setFilteredStages(filtered)
    setAllChecked(isAllChecked())
  }, [section, stages, search])

  React.useEffect(() => setAllChecked(isAllChecked()), [filteredStages])

  return (
    <Box p='16px' display='block'>
      <Flex direction='column'>
        <Input
          flex
          label='search'
          icon='search'
          width='100%'
          onChange={value => setSearch(value.toLowerCase())}
          onChangeDebounceDuration={300}
          mb={theme.s2}
          placeholder={`Search stages...`}
        />
      </Flex>
      {filteredStages.length ? (
        <CheckboxList
          allChecked={allChecked}
          someChecked={isSomeChecked()}
          onAllChecked={handleAllChecked}
        >
          {filteredStages.map(stage => (
            <StageItem
              key={`${section.id}${stage.id}`}
              section={section}
              stage={stage}
              {...props}
            />
          ))}
        </CheckboxList>
      ) : (
        <Box>
          <Text small>No stages found</Text>
        </Box>
      )}
    </Box>
  )
}
