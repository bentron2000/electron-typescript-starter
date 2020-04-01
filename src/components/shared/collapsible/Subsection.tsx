import * as React from 'react'
import styled, { css } from 'styled-components'
import { Box, Text, Avatar, Flex, Button, Icon } from '../../shared'
import { theme } from '../Theme/theme'

const CollapsibleContainer = styled.div<ISubsection>`
  position: relative;
  width: 100%;
  background: none;
  display: flex;
  flex-direction: column;
  overflow: none;
  ${props => !props.borderless && `border-bottom: 1px solid #3d414c`};
  ${(props: { onClick?: () => void }) =>
    props.onClick &&
    css`
      cursor: pointer;
    `};
`

const CollapsibleHeader = styled.div<ISubsection>`
  display: flex;
  flex-direction: row;
  justify-items: flex-start;
  align-items: center;
  padding: ${theme.s3};
  ${props => !props.borderless && `border-bottom: 0px solid #3d414c`};
  z-index: 100;
  background-color: ${props => props.bg};
  cursor: pointer;
  :hover {
    background-color: #2a303c;
  }

  ${props =>
    props.expanded &&
    !props.borderless &&
    css<ISubsection>`
      border-bottom: 1px solid #3d414c;
    `};

  ${props =>
    props.minimal &&
    css<ISubsection>`
      border-bottom: 0;
      padding: ${theme.s1};
      color: ${theme.grayLight}
      :hover {
        background-color: ${theme.grayDarkest};
        color: white;
      }
    `};
`

const CollapsibleContent = styled.div<ISubsection>`
  display: flex;
  flex-direction: column;
  display: none;
  padding-bottom: 0;
  background-color: rgba(27, 32, 42, 0.5);

  ${(props: { expanded?: boolean }) =>
    props.expanded &&
    css<ISubsection>`
      display: block;
    `}

  ${(props: { minimal?: boolean }) =>
    props.minimal &&
    css<ISubsection>`
      background: none;
      padding: 0;
    `};
`

// Typing

interface ISubsection {
  children?: React.ReactNode
  onClick?: () => void
  heading?: React.ReactNode
  icon?: string
  subtitle?: string
  expanded?: boolean
  showAvatar?: boolean
  avatarBg?: string
  avatarAcronym?: string
  image?: string
  bg?: string
  minimal?: boolean
  borderless?: boolean
}

// Render

export const Subsection = (props: ISubsection) => {
  props = { expanded: false, avatarBg: theme.primary, ...props }
  const [collapsibleOpen, setCollapsibleOpen] = React.useState(props.expanded)

  return (
    <CollapsibleContainer
      expanded={collapsibleOpen}
      {...props}
      onClick={props.onClick}
    >
      <CollapsibleHeader
        onClick={() => setCollapsibleOpen(!collapsibleOpen)}
        {...props}
      >
        {(props.icon || props.showAvatar) && (
          <Box color={theme.grayLight} mr={theme.s2}>
            {props.icon && <Icon name={props.icon} width='24px' />}
            {props.showAvatar && (
              <Avatar
                small
                bg={props.avatarBg}
                name={props.avatarAcronym}
                image={props.image}
              />
            )}
          </Box>
        )}
        <Flex direction='column' width='100%'>
          {props.heading}
          <Text mb='0' color={theme.grayLighter} small>
            {props.subtitle}
          </Text>
        </Flex>
        <Flex height='40px' direction='row' flex={0}>
          {props.children && (
            <Button
              icon={collapsibleOpen ? 'collapse' : 'expand'}
              color={collapsibleOpen ? 'white' : theme.grayLight}
              padding={theme.s2}
              hoverColor='white'
            />
          )}
        </Flex>
      </CollapsibleHeader>
      {props.children && (
        <CollapsibleContent expanded={collapsibleOpen} minimal={props.minimal}>
          {props.children}
        </CollapsibleContent>
      )}
    </CollapsibleContainer>
  )
}
