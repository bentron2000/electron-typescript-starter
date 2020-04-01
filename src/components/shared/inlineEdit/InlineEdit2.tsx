import * as React from 'react'
import styled, { css } from 'styled-components'
import { Box } from '../layout/Box'
import { Text } from '../typography/Text'
import { Input } from '../input/Input'
import { theme } from '../Theme/theme'

export interface IInlineEdit2EditViewProps {
  value: string
  autoFocus: boolean
  minimal: boolean
}

export interface IInlineEdit2ReadViewProps {
  value: string
  onClick: (event: React.MouseEvent) => void
  onDoubleClick: (event: React.MouseEvent) => void
}

export interface IInlineEdit2 {
  value: string
  autoFocus?: boolean
  toggleEditView?: boolean
  minimal?: boolean
  disabled?: boolean
  saveOnEnter?: boolean
  doubleClickToEdit?: boolean
  onSave: (value: string) => void
  onClick?: (e: React.MouseEvent) => void
  onDblClick?: (e: React.MouseEvent) => void
  editView?: (editProps: IInlineEdit2EditViewProps) => JSX.Element
  readView?: (readProps: IInlineEdit2ReadViewProps) => JSX.Element
  // allow styled-components extension
  className?: string
}

interface IEditableContainer {
  doubleClickToEdit: boolean
}
const EditableContainer = styled.div<IEditableContainer>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transition: background 200ms;
  overflow-wrap: break-word;
  hyphens: auto;
  width: 100%;
  margin: 0;
  ${({ doubleClickToEdit }) => css`
    cursor: ${doubleClickToEdit ? 'pointer' : 'text'};
  `}

  input {
    box-sizing: border-box;
  }
`

const ReadViewBox = styled(Box)`
  border-radius: 4px;
  padding: ${theme.s2};
  :hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`

const EditableInput = styled(Input)<IInlineEdit2EditViewProps>`
  width: 100%;
  :focus {
    background: none;
    border: ${props => (props.minimal ? 'none' : `1px solid ${theme.primary}`)};
    outline: none;
    margin: -1px;
  }
`

export const InlineEdit2EditView = (props: IInlineEdit2EditViewProps) => {
  return <EditableInput width='100%' {...props} />
}

export const InlineEdit2ReadView = ({
  value,
  ...props
}: IInlineEdit2ReadViewProps) => {
  return (
    <ReadViewBox {...props}>
      <Text ellipsis mb='0' body>
        {value}
      </Text>
    </ReadViewBox>
  )
}

export const InlineEdit2 = ({
  value: initialValue,
  toggleEditView = false,
  autoFocus = true,
  saveOnEnter = true,
  doubleClickToEdit = false,
  minimal = false,
  disabled = false,
  onSave,
  onClick,
  onDblClick,
  editView = InlineEdit2EditView,
  readView = InlineEdit2ReadView,
  className,
}: IInlineEdit2) => {
  let timer = 0
  let preventSingleClick = false

  const [editing, setEditing] = React.useState(toggleEditView)
  const [value, setValue] = React.useState(initialValue)

  const saveEdit = () => {
    onSave(value)
    setEditing(false)
  }

  const toggleEditing = () => setEditing(!editing)

  const handleEditOnBlur = () => saveEdit()

  const handleEditOnChange = (val: string) => setValue(val)

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (saveOnEnter && event.key === 'Enter') {
      saveEdit()
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!doubleClickToEdit) {
      toggleEditing()
    }
    if (onClick) {
      onClick(e)
    }
  }

  const handleDblClick = (e: React.MouseEvent) => {
    if (doubleClickToEdit) {
      toggleEditing()
    }
    if (onDblClick) {
      onDblClick(e)
    }
  }

  const readViewProps: IInlineEdit2ReadViewProps = {
    value,
    // Allow binding different Events to Click and Double Click which requires a slight delay
    // on firing off the normal click action.
    onClick: e => {
      e.stopPropagation()
      timer = setTimeout(() => {
        if (!preventSingleClick) {
          handleClick(e)
        }
        preventSingleClick = false
      }, 250)
    },
    onDoubleClick: e => {
      e.stopPropagation()
      clearTimeout(timer)
      preventSingleClick = true
      handleDblClick(e)
    },
  }

  const editViewProps = {
    value,
    autoFocus,
    minimal,
    onChange: handleEditOnChange,
    onKeyUp: handleKeyUp,
  }

  React.useEffect(() => setEditing(toggleEditView), [toggleEditView])

  return (
    <EditableContainer
      className={className}
      doubleClickToEdit={doubleClickToEdit}
      onBlur={handleEditOnBlur}
    >
      {editing && !disabled ? editView(editViewProps) : readView(readViewProps)}
    </EditableContainer>
  )
}
