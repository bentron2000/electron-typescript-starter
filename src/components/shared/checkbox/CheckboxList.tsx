import * as React from 'react'
import { Flex } from '..'
import { BoxCheckbox } from './'

interface CheckboxList {
  label?: string
  allChecked?: boolean
  hideBoxCheck?: boolean
  reverseAllChecked?: boolean
  someChecked?: boolean
  onAllChecked: (allChecked: boolean) => void
  children: any
}

export interface CheckboxListChildProps {
  allChecked?: boolean
}

interface CheckboxListItem {
  allChecked?: boolean
  render: (props: CheckboxListChildProps) => JSX.Element
}

// Can be used for rendering list of checkboxes where Checkbox or BoxCheckbox are used directly,
// instead of wrapped in your own component. This is so allChecked can be provided to the function
// without having to have this prop managed in the Checkbox/BoxCheckbox components.
export const CheckboxListItem = ({
  allChecked,
  ...props
}: CheckboxListItem) => {
  return props.render({ allChecked })
}

// NOTE: Checkbox & BoxCheckbox components cannot be direct children of CheckboxList. Use
// CheckboxListItem render prop to render those components.
export const CheckboxList = ({
  someChecked = false,
  allChecked = false,
  hideBoxCheck = false,
  reverseAllChecked = false,
  onAllChecked,
  ...props
}: CheckboxList) => {
  someChecked = !allChecked && someChecked
  const boxCheckLabel = () => {
    if (reverseAllChecked) {
      return !allChecked || someChecked ? 'Select All' : 'Deselect All'
    } else {
      return allChecked || someChecked ? 'Deselect All' : 'Select All'
    }
  }

  const handleOnAllCheckedChange = () => {
    // Default behaviour is forcing a "deselect" action when someChecked.
    // reverseAllChecked can be set to true to reverse this.
    onAllChecked(someChecked ? reverseAllChecked : !allChecked)
  }

  return (
    <Flex direction='column'>
      {!hideBoxCheck && <BoxCheckbox
        someChecked={someChecked}
        checked={allChecked}
        onChange={handleOnAllCheckedChange}
      >
        {boxCheckLabel()}
      </BoxCheckbox>}
      {React.Children.map(props.children, checkbox =>
        React.cloneElement(checkbox, { allChecked })
      )}
    </Flex>
  )
}
