import * as React from 'react'
import { all, any, union } from 'ramda'
import { theme } from '../../../shared/Theme/theme'

import { LoupeRealmResponse, LoupeRealmErrorResponse } from '@models/ipc'
import { Section, Stage } from '@models'
import { useStateLockedByPromise } from '@components/helpers'
import { useToasts } from '@components/shared/toast/ToastProvider'
import {
  Box,
  CheckboxList,
  BoxCheckbox,
  CheckboxListChildProps,
  Flex,
  Input,
  Text,
} from '@components/shared'

interface SectionItem
  extends CheckboxListChildProps,
    Pick<WorkflowSectionsPane, 'stage' | 'stageSections' | 'updateStage'> {
  section: Section
}

const isSectionAttributed = (stageSections: Section[], sectionId: string) => {
  return Boolean(
    stageSections.find(attributedSection => attributedSection.id === sectionId)
  )
}

const SectionItem = ({
  stage,
  section,
  stageSections,
  updateStage,
  ...props
}: SectionItem) => {
  const { addToast } = useToasts()
  const isAttributed = isSectionAttributed(stageSections(stage.id), section.id)
  const [checked, locked, setChecked] = useStateLockedByPromise(isAttributed)

  const handleChecked = () => {
    if (locked) {
      return
    }

    const newChecked = !checked
    stage.sectionIds = newChecked
      ? [...stage.sectionIds, section.id]
      : stage.sectionIds.filter(id => id !== section.id)
    const promise = updateStage(stage)
    setChecked(newChecked, promise) // Eagerly set state
    promise.catch((err: LoupeRealmErrorResponse) => {
      setChecked(!newChecked) // Restore state
      addToast(err.message, { type: 'negative' })
    })
  }

  React.useEffect(() => setChecked(isAttributed), [
    stage,
    stageSections(stage.id),
  ])

  return (
    <BoxCheckbox checked={checked} onChange={handleChecked} {...props}>
      {section.name}
    </BoxCheckbox>
  )
}

interface WorkflowSectionsPane {
  sections: Section[]
  stage: Stage
  stageSections: (stageId: string) => Section[]
  updateStage: (payload: Stage) => Promise<LoupeRealmResponse>
}

export const WorkflowSectionsPane = ({
  sections,
  stage,
  ...props
}: WorkflowSectionsPane) => {
  const { addToast } = useToasts()
  const [search, setSearch] = React.useState('')
  const [filteredSections, setFilteredSections] = React.useState(sections)
  const isAllChecked = () =>
    all(
      section => isSectionAttributed(props.stageSections(stage.id), section.id),
      filteredSections
    )
  const isSomeChecked = () =>
    any(
      section => isSectionAttributed(props.stageSections(stage.id), section.id),
      filteredSections
    )
  const [allChecked, locked, setAllChecked] = useStateLockedByPromise(
    isAllChecked()
  )

  const handleAllChecked = (newAllChecked: boolean) => {
    if (locked) {
      return
    }

    const ids = filteredSections.map(s => s.id)
    stage.sectionIds = newAllChecked
      ? union(stage.sectionIds, ids)
      : stage.sectionIds.filter(id => !ids.includes(id))
    const promise = props.updateStage(stage)
    setAllChecked(newAllChecked, promise)
    promise.catch((err: LoupeRealmErrorResponse) => {
      setAllChecked(!newAllChecked)
      addToast(err.message, { type: 'negative' })
    })
  }

  React.useEffect(() => {
    const filtered = search
      ? sections.filter(s => s.name.toLowerCase().includes(search))
      : sections
    setFilteredSections(filtered)
    setAllChecked(isAllChecked())
  }, [stage, sections, search])

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
          placeholder={`Search sections...`}
        />
      </Flex>
      {filteredSections.length ? (
        <CheckboxList
          label='All Brief Sections'
          allChecked={allChecked}
          someChecked={isSomeChecked()}
          onAllChecked={handleAllChecked}
        >
          {filteredSections.map(section => (
            <SectionItem
              key={`${stage.id}${section.id}`}
              section={section}
              stage={stage}
              {...props}
            />
          ))}
        </CheckboxList>
      ) : (
        <Box>
          <Text small>No sections found</Text>
        </Box>
      )}
    </Box>
  )
}
