import * as React from 'react'
import styled from 'styled-components'
import { InputSlider, IInputSlider, Flex, Button, IButton } from '..'
import { theme } from '../Theme/theme'

const AssetsZoomBarContainer = styled(Flex)`
  margin: 0 15px;
`

const StyledInputSlider = styled(InputSlider)`
  margin: 0 5px;
`

const SmallGridIconButton = (props: AssetsZoomBar & IButton) => {
  const color = () =>
    props.zoom >= (props.min + props.max) / 2
      ? theme.grayLighter
      : theme.elementLightGrey

  return (
    <Button color={color()} hoverColor='white' padding={theme.s1} {...props} />
  )
}

const LargeGridIconButton = (props: AssetsZoomBar & IButton) => {
  const color = () =>
    props.zoom < (props.min + props.max) / 2
      ? theme.grayLighter
      : theme.elementLightGrey

  return (
    <Button color={color()} hoverColor='white' padding={theme.s1} {...props} />
  )
}

type DefaultProps = Readonly<typeof defaultProps>
type AssetsZoomBar = { zoom: number } & IInputSlider & DefaultProps

const defaultProps = {
  min: 2,
  max: 10,
  width: '120px',
  reversed: true
}

export const AssetsZoomBar = (props: AssetsZoomBar & DefaultProps) => {
  return (
    <AssetsZoomBarContainer align='center' flex={0}>
      <SmallGridIconButton
        icon='ninegrid'
        onClick={() => props.onChange && props.onChange(props.max)}
        {...props}
      />
      <StyledInputSlider defaultValue={props.zoom} {...props} />
      <LargeGridIconButton
        icon='grid'
        onClick={() => props.onChange && props.onChange(props.min)}
        {...props}
      />
    </AssetsZoomBarContainer>
  )
}

AssetsZoomBar.defaultProps = defaultProps
