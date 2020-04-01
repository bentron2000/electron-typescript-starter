import * as React from 'react'
import styled from 'styled-components'
import { SliderItem, GetTrackProps } from 'react-compound-slider'

const Track = ({
  getTrackProps,
  className
}: {
  source: SliderItem
  target: SliderItem
  getTrackProps: GetTrackProps | (() => undefined)
  disabled: boolean
  className?: string
}) => {
  return <div className={className} {...getTrackProps()} />
}

export const InputSliderTrack = styled(Track)`
  position: absolute;
  transform: translate(0%, -50%);
  height: 8px;
  z-index: 1;
  background-color: ${({ disabled }: { disabled: boolean }) =>
    disabled ? '#999' : '#3B424F'};
  border-radius: 7px;
  cursor: pointer;
  left: ${({ source }: { source: SliderItem }) => `${source.percent}%`};
  width: ${({ target, source }: { target: SliderItem; source: SliderItem }) =>
    `${target.percent - source.percent}%`};
`
