import * as React from 'react'
import styled, { css } from 'styled-components'
import { Box } from '../layout/Box'
import { Icon } from '../icons/Icon'
import { theme } from '../Theme/theme'
import { debounce } from 'lodash'

const InputContainer = styled.input<Omit<Input, 'onChange' | 'onBlur'>>`
  margin-right: ${props => props.mr};
  margin-left: ${props => props.ml};
  margin-bottom: ${props => props.mb};
  background-color: ${theme.elementLightGrey};
  width: ${props => props.width};
  color: white;
  border-radius: 4px;
  border: 0px;
  padding: ${theme.s2};
  font: 400 16px/24px ${theme.primaryFont};
  caret-color: ${theme.primary};
  &::placeholder {
    color: ${theme.grayLight};
  }
  :hover {
    background-color: #454e5e;
  }
  :focus {
    outline: 0;
    background-color: #454e5e;
  }
  ${props =>
    props.icon &&
    css`
      padding-left: 40px;
    `}
`

const IconContainer = styled.div`
  position: absolute;
  left: 0;
  color: ${theme.grayLight};
  padding: ${theme.s2};
  pointer-events: none;
`

const Label = styled.label`
  display: none;
  text-transform: capitalize;
  padding-bottom: ${theme.s1};
  color: white;
  font: 400 16px/24px ${theme.primaryFont};
  ${(props: { showLabel?: boolean }) =>
    props.showLabel &&
    css`
      display: block;
    `};
`

interface Input {
  label?: string
  value?: string
  showLabel?: boolean
  icon?: string
  placeholder?: string
  ml?: string
  mr?: string
  mb?: string
  width?: string
  flex?: boolean
  onBlur?: (value: string) => void
  onChange?: (value: string) => void
  onChangeDebounceDuration?: number
}

export const Input = ({ onChangeDebounceDuration = 0, ...props }: Input) => {
  const [value, setValue] = React.useState<string>(props.value || '')
  const handleBlur = () => (props.onBlur ? props.onBlur(value) : undefined)
  const debouncedOnChangeCallback = props.onChange
    ? React.useCallback(debounce(props.onChange, onChangeDebounceDuration), [])
    : undefined
  const handleChange = (val: string) => {
    if (debouncedOnChangeCallback) {
      debouncedOnChangeCallback(val)
    }
  }
  return (
    <Box>
      <Label showLabel={props.showLabel} htmlFor={props.label}>
        {props.label}
      </Label>
      <Box display={props.flex ? 'flex' : 'block'}>
        {props.icon && (
          <IconContainer>
            <Icon name={props.icon} width='24px' />
          </IconContainer>
        )}
        <InputContainer
          {...props}
          value={value}
          onChange={e => {
            setValue(e.target.value)
            handleChange(e.target.value)
          }}
          placeholder={props.placeholder}
          id={props.label}
          onBlur={handleBlur}
        />
      </Box>
    </Box>
  )
}
