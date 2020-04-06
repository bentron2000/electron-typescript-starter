import * as React from 'react'

import { TreeDefinition } from '@models/TreeDefinition'
import { LoupeRealmResponse, LoupeRealmErrorResponse } from '@models/ipc'
import { fileFormats } from '@models/fileFormats'

import {
  Box,
  CheckboxList,
  BoxCheckbox,
  CheckboxListChildProps,
} from '@components/shared'
import { useToasts } from '@components/shared/toast/ToastProvider'
import { useStateLockedByPromise } from '@components/helpers'

interface TreeFileFormatPane extends CheckboxListChildProps {
  currentTD: TreeDefinition
  updateTD: (treeDefinition: TreeDefinition) => Promise<LoupeRealmResponse>
}

interface FormatItem extends TreeFileFormatPane {
  format: string
  children: React.ReactChild
}

const FormatItem = ({
  updateTD,
  currentTD,
  format,
  children,
  ...props
}: FormatItem) => {
  const { addToast } = useToasts()

  const handleUpdateTdError = (err: LoupeRealmErrorResponse) => {
    addToast(err.message, { type: 'negative' })
  }

  const handleFormatAllowedChange = () => {
    currentTD.allowedFormats = !currentTD.allowedFormats.includes(format)
      ? [...currentTD.allowedFormats, format]
      : currentTD.allowedFormats.filter(a => a !== format)
    updateTD(currentTD).catch(handleUpdateTdError)
  }

  return (
    <BoxCheckbox
      checked={currentTD.allowedFormats.includes(format)}
      onChange={handleFormatAllowedChange}
      {...props}
    >
      {format}
    </BoxCheckbox>
  )
}

export const TreeFileFormatPane = ({
  currentTD,
  updateTD,
  ...props
}: TreeFileFormatPane) => {
  const { addToast } = useToasts()

  const isAllChecked = fileFormats
    .displayList()
    .every(f => currentTD.allowedFormats.includes(f))
  const isSomeChecked = fileFormats
    .displayList()
    .some(f => currentTD.allowedFormats.includes(f))

  const [allChecked, locked, setAllChecked] = useStateLockedByPromise(
    isAllChecked
  )

  const handleOnAllChecked = (newAllChecked: boolean) => {
    if (locked) {
      return
    }
    currentTD.allowedFormats = isSomeChecked ? [] : fileFormats.displayList()
    const promise = updateTD(currentTD)
    setAllChecked(newAllChecked, promise)
    promise.catch((err: LoupeRealmErrorResponse) => {
      setAllChecked(!newAllChecked)
      addToast(err.message, { type: 'negative' })
    })
    updateTD(currentTD)
  }

  React.useEffect(() => setAllChecked(isAllChecked), [currentTD.allowedFormats])

  return (
    <Box p='16px' display='block'>
      <CheckboxList
        allChecked={allChecked}
        someChecked={isSomeChecked}
        onAllChecked={handleOnAllChecked}
        label='All Image Formats'
      >
        {fileFormats.displayList().map((format, i) => (
          <FormatItem
            key={i}
            format={format as string}
            currentTD={currentTD}
            updateTD={updateTD}
            {...props}
          >
            {format as string}
          </FormatItem>
        ))}
      </CheckboxList>
    </Box>
  )
}
