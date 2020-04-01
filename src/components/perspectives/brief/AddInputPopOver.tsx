import * as React from 'react'
import { List } from '../../shared'
import { BriefAddContentPanel } from '.'

interface AddInputPopOver {
  createInput: (input: any) => void
}

interface AddInputPopOverContent extends AddInputPopOver {
  // BriefAddContentPanel clones the AddInputPopOverContent component, applying
  // this closeTooltip callback to props.
  closeTooltip?: () => void
}

const AddInputPopOverContent = (props: AddInputPopOverContent) => {
  const inputs = [
    { value: 'text', label: 'Text Block', icon: 'input' },
    { value: 'daterange', label: 'Date Range', icon: 'input' },
    { value: 'image', label: 'Image Assets', icon: 'image' },
    { value: 'canvas', label: 'Canvas', icon: 'image' },
  ]
  const handleClick = (input: any) => {
    props.createInput(input)
    if (props.closeTooltip) {
      props.closeTooltip()
    }
  }
  return <List items={inputs} onClick={handleClick} />
}

export const AddInputPopOver = (props: AddInputPopOver) => {
  return (
    <BriefAddContentPanel
      text='add input'
      tooltipContent={<AddInputPopOverContent {...props} />}
      tooltipProps={{ width: 256, padding: '0' }}
    />
  )
}
