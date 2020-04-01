import * as React from 'react'
import styled, { css } from 'styled-components'
import { Text } from '../typography/Text'
import { theme } from '../Theme/theme'

const LozengeContainer = styled.div`
  display: inline-block;
  position: relative;
  border-radius: 20px;
  border: 1px solid ${theme.grayLighter};
  text-align: center;
  color: ${theme.grayLighter};
  margin-right: ${theme.s2};
  margin-bottom: ${theme.s2};
  cursor: pointer;
  user-select: none;

  :hover {
    filter: brightness(1.2);
  }
  > input {
    opacity: 0;
    position: absolute;
  }
  > input + label {
    position: relative;
    cursor: pointer;
  }

  label {
    text-align: center;
    padding: ${theme.s1} ${theme.s3};
    display: inherit;
  }

  ${(props: { isChecked?: boolean }) =>
    props.isChecked &&
    css`
      border: 1px solid ${theme.primary};
      color: ${theme.primary};
    `};
`

interface Lozenge {
  children?: React.ReactNode
  checkId?: string
  isChecked?: boolean
  onChange?: () => void
}

export const Lozenge = (props: Lozenge) => {
  return (
    <LozengeContainer isChecked={props.isChecked} {...props}>
      <input
        type='checkbox'
        id={props.checkId}
        checked={props.isChecked}
        onChange={() => props.onChange && props.onChange()}
      />
      <label htmlFor={props.checkId}>
        <Text body display='inline' color='inherit'>
          {props.children}
        </Text>
      </label>
    </LozengeContainer>
  )
}
