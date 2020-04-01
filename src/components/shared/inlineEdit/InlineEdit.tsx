import * as React from 'react'
import styled from 'styled-components'
import { theme } from '../Theme/theme'
import { useEditable } from '@components/helpers'
import { Box, Button } from '../../shared'

// Styled Components

const EditableContainer = styled.div<InlineEdit>`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  transition: background 200ms;
  padding: ${props => props.p};
  cursor: text;
  caret-color: ${theme.primary};
  overflow-wrap: break-word;
  hyphens: auto;

  :hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  :focus {
    background: none;
    border: ${props =>
      props.minimal ? 'none' : `1px solid ${theme.primary};`};
    outline: none;
    margin: -1px;
  }
`

const Controls = styled.div<InlineEdit>`
  position: absolute;
  bottom: -36px;
  right: -16px;
  display: flex;
  flex-direction: row;
  z-index: 1000;
`
// Typing

interface InlineEdit {
  children?: React.ReactNode
  p?: string
  width?: string
  saveOnEnter?: boolean
  showControls?: boolean
  minimal?: boolean
  disabled?: boolean
  saveContent?: (string: string) => void
  sanitizeContent?: (string: string) => string
  validateContent?: (string: string) => boolean
}

// Render

export const InlineEdit = (props: InlineEdit) => {
  const [contentFocused, setContentFocused] = React.useState(false)
  const [value, setValue] = React.useState('')
  const [update, setForceUpdate] = React.useState(Math.random()) // change this value to force refresh from original props on cancel

  const handleTick = (_event: React.SyntheticEvent) => {
    setContentFocused(false)
    if (props.saveContent) {
      props.saveContent(value)
    }
  }

  const handleCross = (_event: React.SyntheticEvent) => {
    setContentFocused(false)
    setForceUpdate(update + 1)
  }

  const onBlurCallback = (
    _event: React.SyntheticEvent,
    currentValue: string
  ) => {
    if (props.saveContent) {
      props.saveContent(currentValue)
    }
  }

  const onFocusCallback = () => {
    setContentFocused(true)
  }

  const onEnterCallback = () => {
    setContentFocused(false)
    console.log('onEnterCallback')
  }

  const onTabCallback = () => {
    setContentFocused(false)
    console.log('onTabCallback')
  }

  const onEscapeCallback = () => {
    setContentFocused(false)
    setForceUpdate(update + 1)
    console.log('onEscapeCallback', value)
  }

  const [isEditable] = useEditable({
    saveOnEnter: props.saveOnEnter,
    saveCallback: setValue,
    sanitizeFunc: props.sanitizeContent,
    validateFunc: props.validateContent,
    onBlurCallback,
    onFocusCallback,
    onEnterCallback,
    onTabCallback,
    onEscapeCallback,
  })

  const editable = props.saveContent ? isEditable : []

  const contentNode = React.useRef<HTMLDivElement>(null)

  const hideControls = () => {
    setContentFocused(false)
  }

  const handleClick = (event: any) => {
    if (
      !contentNode.current ||
      (contentNode.current && contentNode.current!.contains(event.target))
    ) {
      return
    }
    hideControls()
  }

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  })

  return (
    <Box width={props.width || 'auto'}>
      {props.disabled ? (
        props.children
      ) : (
        <EditableContainer
          ref={contentNode}
          tabIndex={1}
          key={update}
          {...editable}
          {...props}
        >
          {props.children}
          {props.showControls && contentFocused && (
            <Controls {...props}>
              <Box bg='white' radius='4px' mr={theme.s1}>
                <Button
                  color={theme.grayLight}
                  padding={theme.s1}
                  icon='tick-sml'
                  hoverColor={theme.primary}
                  onClick={handleTick}
                />
              </Box>
              <Box bg='white' radius='4px'>
                <Button
                  color={theme.grayLight}
                  padding={theme.s1}
                  icon='close'
                  hoverColor={theme.primary}
                  onClick={handleCross}
                />
              </Box>
            </Controls>
          )}
        </EditableContainer>
      )}
    </Box>
  )
}
