import * as React from 'react'
import styled, { css } from 'styled-components'
import { Box } from '../layout/Box'
import { Icon } from '../icons/Icon'
import { theme } from '../Theme/theme'
import { Flex } from '../layout/Flex'

const SelectContainer = styled(Flex)<Select>`
  margin-right: ${props => props.mr};
  margin-left: ${props => props.ml};
  margin-bottom: ${props => props.mb};
  position: relative;
  background-color: ${theme.elementLightGrey};
  color: white;
  border-radius: 4px;
  border: 0px;
  font: 400 16px/24px ${theme.primaryFont};
  :hover {
    background-color: #454e5e;
  }
  :focus {
    background-color: #454e5e;
  }
`

const StyledSelect = styled.select`
  cursor: pointer;
  background: transparent;
  border: none;
  font-size: 14px;
  color: white;
  height: 40px;
  display: flex;
  flex: 1;
  -webkit-appearance: none;
  :focus {
    outline: 0;
  }
`

const IconContainer = styled(Flex)`
  color: ${theme.grayLight};
  padding: ${theme.s2};
  flex: 0;
`

const ChevronContainer = styled(Flex)`
  color: ${theme.grayLight};
  padding: ${theme.s2};
  flex: 0;
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

interface Select {
  label?: string
  value?: string
  showLabel?: boolean
  icon?: string
  children?: React.ReactNode
  ml?: string
  mr?: string
  mb?: string
  w?: string
  default?: string
  initialValue?: string
  handleChange?: (value: string) => void
  disabled?: boolean
}

export const Select = (props: Select) => {
  return (
    <Box width={props.w}>
      <Label {...props} htmlFor={props.label}>
        {props.label}
      </Label>
      <SelectContainer align='center' {...props}>
        {props.icon && (
          <IconContainer>
            <Icon name={props.icon} width='24px' />
          </IconContainer>
        )}
        <StyledSelect
          disabled={props.disabled}
          value={props.initialValue}
          onClick={e => e.stopPropagation()}
          onChange={e =>
            props.handleChange && props.handleChange(e.target.value)
          }
          id={props.label}
        >
          {props.default && <option value='' disabled hidden>
            {props.default}
          </option>}
          {props.children}
        </StyledSelect>
        <ChevronContainer>
          <Icon name='chevron' width='16px' />
        </ChevronContainer>
      </SelectContainer>
    </Box>
  )
}
