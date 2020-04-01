import * as React from 'react'
import styled, { css } from 'styled-components'
import { Box, Button, Flex, Heading, Text, InlineEdit } from '../../shared'
import { theme } from '../Theme/theme'

// Styled Components

const CollapsibleContainer = styled.div<Collapsible>`
  position: relative;
  width: auto;
  background: ${props => props.bg};
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  overflow: none;
  margin-bottom: ${theme.s3};
  padding-bottom: 0px;
  ${(props: Pick<Collapsible, 'expanded'>) =>
    props.expanded &&
    css<Collapsible>`
      padding-bottom: ${theme.s2};
    `}

  ${(props: { border?: string }) =>
    props.border &&
    css<Collapsible>`
      border: 1px solid ${prp => prp.border};
      margin: -1px;
    `}
`

const Hovered = styled.div<Collapsible>`
  border: 0px solid ${theme.primary};
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 4px;
  pointer-events: none;
`

const ControlsContainer = styled.div<Collapsible>`
  opacity: 1;
  transition: opacity 100ms;
  display: flex;
  flex-direction: row;

  ${(props: Pick<Collapsible, 'hideControls'>) =>
    props.hideControls &&
    css<Collapsible>`
      opacity: 0;
    `}
`

const CollapsibleHeader = styled.div<Collapsible>`
  display: flex;
  flex-direction: row;
  justify-items: space-between;
  padding: ${theme.s3};
  padding-bottom: 0;

  ${(props: Pick<Collapsible, 'subtitle'>) =>
    !props.subtitle &&
    css<Collapsible>`
      padding-bottom: ${theme.s2};
      justify-content: center;
    `}

  :hover ${ControlsContainer} {
    opacity: 1;
  }

  :hover ${Hovered} {
    ${(props: Pick<Collapsible, 'hoverable'>) =>
      props.hoverable &&
      css<Collapsible>`
        border: 1px solid ${theme.primary};
      `}
  }
`

const CollapsibleContent = styled.div<Collapsible>`
  display: flex;
  flex-direction: column;
  display: none;
  padding: ${theme.s3};
  padding-bottom: ${theme.s1};

  ${(props: Pick<Collapsible, 'expanded'>) =>
    props.expanded &&
    css<Collapsible>`
      display: block;
    `}
`

// Typing

interface Collapsible {
  children?: React.ReactNode
  controls?: React.ReactNode
  heading?: string
  headingControls?: React.ReactNode
  subtitle?: string | React.ReactNode
  editable?: boolean
  expanded?: boolean
  hoverable?: boolean
  hideControls?: boolean
  showEditableControls?: boolean
  saveOnEnter?: boolean
  bg?: string
  border?: string
  medium?: boolean
  small?: boolean
  color?: string
  size?: 'xlarge' | 'large' | 'medium' | 'small'
  onClick?: (event: React.MouseEvent) => void
  // Props for editable heading...
  saveHeading?: (string: string) => void
  sanitizeHeading?: (string: string) => string
  validateHeading?: (string: string) => boolean
}

// Render

export const Collapsible = (props: Collapsible) => {
  props = {
    editable: true,
    expanded: true,
    color: 'white',
    bg: 'rgba(27,32,42,0.3)',
    ...props,
  }
  const [collapsibleOpen, setCollapsibleOpen] = React.useState(props.expanded)

  return (
    <CollapsibleContainer expanded={collapsibleOpen} {...props}>
      <CollapsibleHeader {...props}>
        <Flex direction='column' justify='center'>
          {props.editable ? (
            <Box display='flex'>
              <InlineEdit
                saveContent={props.saveHeading}
                sanitizeContent={props.sanitizeHeading}
                validateContent={props.validateHeading}
                p={theme.s2}
                saveOnEnter={props.saveOnEnter}
                showControls={props.showEditableControls}
              >
                <Heading mb='0' color={props.color} size={props.size}>
                  {props.heading}
                </Heading>
              </InlineEdit>
              {props.headingControls}
            </Box>
          ) : (
            <Box p={theme.s2}>
              <Heading mb='0' color={props.color} size={props.size}>
                {props.heading}
              </Heading>
            </Box>
          )}
          {props.subtitle &&
            (typeof props.subtitle === 'string' ? (
              <Text mb={theme.s2} color={theme.grayLighter} subtitle>
                {props.subtitle}
              </Text>
            ) : (
              props.subtitle
            ))}
        </Flex>
        <Flex height='40px' direction='row' flex={0} basis='auto'>
          <ControlsContainer {...props}>{props.controls}</ControlsContainer>
          {props.children && (
            <Button
              onClick={() => setCollapsibleOpen(!collapsibleOpen)}
              icon={collapsibleOpen ? 'collapse' : 'expand'}
              color={collapsibleOpen ? 'white' : theme.grayLight}
              padding={theme.s2}
              hoverColor='white'
            />
          )}
        </Flex>
        <Hovered />
      </CollapsibleHeader>
      {props.children && (
        <CollapsibleContent expanded={collapsibleOpen}>
          {props.children}
        </CollapsibleContent>
      )}
    </CollapsibleContainer>
  )
}
