import * as React from 'react'
import styled, { css } from 'styled-components'
import { Flex, Icon, Text, Box } from '..'
import { theme } from '../Theme/theme'

type ListItemRowProps = Pick<List, 'onClick'>

const ListItemRow = styled(Flex)<ListItemRowProps>`
  padding: 9px 5px;
  border-top: 1px solid ${theme.grayLightest};
  :first-child {
    margin-top: 10px;
  }
  ${props => (
    props.onClick && css`
      cursor: pointer;
      :hover {
        background: ${theme.grayLightest};
      }
    `
  )}
`

const InputIcon = styled(Icon)`
  color: ${theme.grayLight};
  margin: 0 12px;
`

const InputText = styled(Text)`
  font-weight: 500;
  color: ${theme.textDark};
`

interface List {
  items: ListItem[]
  onClick?: (item: ListItem) => void
}

interface ListItem {
  label: string
  value: string
  icon?: string
  // dynamic attributes
  [key: string]: any
}

export const List = (props: List) => {
  const handleClick = (item: ListItem) => {
    if (props.onClick) {
      props.onClick(item)
    }
  }
  return (
    <Box width='100%'>
      <Flex direction='column'>
        {props.items.map((item, index) => (
          <ListItemRow key={index} align='center' onClick={() => handleClick(item)}>
            {item.icon && <InputIcon name={item.icon} width='22px' />}
            <InputText body color='black' mb={'0'}>{item.label}</InputText>
          </ListItemRow>
        ))}
      </Flex>
    </Box>
  )
}
