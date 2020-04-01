import * as React from 'react'
import styled, { css } from 'styled-components'
import { Text } from '../typography/Text'
import { theme } from '../Theme/theme'
import { Checkbox } from './Checkbox'

interface Switch extends Checkbox {}

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
  width: 100%;
  padding: 5px;
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const Icon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`

// Hide checkbox visually but remain accessible to screen readers
const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  clip: rect(0 0 0 0);
  height: 1px;
  width: 1px;
  margin: -1px;
`

const SwitchContainer = styled.div<Checkbox>`
  position: relative;
  display: flex;
  align-items: center;
  color: ${props =>
    props.checked && !props.locked ? 'white' : theme.grayLight};
`

const SwitchBG = styled.div<Checkbox>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: ${props => (props.checked ? 'flex-end' : 'flex-start')};
  width: 42px;
  height: 24px;
  margin-right: 10px;
  background: ${props =>
    props.checked && !props.locked ? theme.green : theme.grayLight};
  border-radius: 12px;
  transition: all 150ms;

  ${CheckboxContainer}:hover & {
    ${props =>
      !props.disabled &&
      !props.locked &&
      css`
        box-shadow: 0 0 0 3px ${theme.green};
      `}
  }

  ${Icon} {
    visibility: ${props => (props.checked ? 'visible' : 'hidden')};
  }
`

const SwitchHead = styled.div<Checkbox>`
  position: absolute;
  left: ${props => (props.checked && !props.locked ? '0' : '17px')};
  width: 20px;
  height: 20px;
  margin-left: 3px;
  margin-right: 3px;
  background-color: white;
  border-radius: 10px;
  transition: all 150ms;
`

export const Switch = ({
  checkId,
  children,
  checked,
  onChange,
  ...props
}: Checkbox) => {
  checked = checked && !props.disabled
  return (
    <CheckboxContainer>
      <CheckboxLabel htmlFor={checkId}>
        <CheckboxLabelText
          small
          mb={'0'}
          display='inline'
          checked={checked}
          {...props}
        >
          {children}
        </CheckboxLabelText>
        <HiddenCheckbox
          id={checkId}
          checked={checked}
          {...(props.locked ? {} : { onChange })}
          {...props}
        />
        <SwitchContainer checked={checked} {...props}>
          <Text mr={theme.s2} mb='0' color='inherit' subtitle>
            {checked ? 'On' : 'Off'}
          </Text>
          <SwitchBG checked={checked} {...props}>
            <SwitchHead checked={checked} {...props} />
          </SwitchBG>
        </SwitchContainer>
      </CheckboxLabel>
    </CheckboxContainer>
  )
}
