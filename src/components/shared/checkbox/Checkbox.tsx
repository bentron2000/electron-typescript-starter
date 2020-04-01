import * as React from 'react'
import styled, { css } from 'styled-components'
import { Text } from '../typography/Text'
import { theme } from '../Theme/theme'

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
  width: 100%;
  padding: 5px;
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  user-select: none;
  cursor: pointer;
`

const CheckboxLabelText = styled(Text)<Checkbox>`
  color: ${props =>
    props.checked && !props.locked ? 'white' : theme.grayLight};
  ${CheckboxContainer}:hover & {
    ${props =>
      !props.disabled &&
      !props.locked &&
      css`
        filter: brightness(1.2);
      `}
  }
`

const CheckedIcon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`

const SomeCheckedIcon = styled.svg`
  fill: white;
  stroke: none;
`

// Hide checkbox visually but remain accessible to screen readers
const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  clip: rect(0 0 0 0);
  height: 1px;
  width: 1px;
  margin: -1px;
`

const StyledCheckbox = styled.div<Checkbox>`
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 10px;
  background: ${props =>
    props.checked && !props.locked && !props.someChecked
      ? theme.green
      : theme.grayLight};
  border-radius: 3px;
  transition: all 150ms;

  ${CheckboxContainer}:hover & {
    ${props =>
      !props.disabled &&
      !props.locked &&
      css`
        box-shadow: 0 0 0 3px ${theme.green};
      `}
  }

  ${CheckedIcon} {
    display: ${props => (props.checked ? 'inherit' : 'none')};
  }

  ${SomeCheckedIcon} {
    display: ${props => (props.someChecked ? 'inherit' : 'none')};
  }
`

export interface Checkbox {
  checked: boolean
  someChecked?: boolean
  checkId?: string
  onChange?: () => void
  children?: React.ReactNode
  disabled?: boolean
  locked?: boolean
}

export const Checkbox = ({
  checkId,
  children,
  checked,
  someChecked,
  onChange,
  ...props
}: Checkbox) => {
  checked = checked && !props.disabled
  const handleChange = () => {
    if (!props.locked && onChange) {
      onChange()
    }
  }
  return (
    <CheckboxContainer>
      <CheckboxLabel htmlFor={checkId}>
        <HiddenCheckbox
          id={checkId}
          checked={checked}
          readOnly={props.locked}
          onChange={handleChange}
          {...props}
        />
        <StyledCheckbox checked={checked} someChecked={someChecked} {...props}>
          <CheckedIcon viewBox='0 0 24 24'>
            <polyline points='20 6 9 17 4 12' />
          </CheckedIcon>
          <SomeCheckedIcon viewBox='0 0 24 24'>
            <rect x='6' y='10' width='12' height='3' />
          </SomeCheckedIcon>
        </StyledCheckbox>
        <CheckboxLabelText
          small
          mb={'0'}
          display='inline'
          checked={checked}
          someChecked={someChecked}
          {...props}
        >
          {children}
        </CheckboxLabelText>
      </CheckboxLabel>
    </CheckboxContainer>
  )
}
