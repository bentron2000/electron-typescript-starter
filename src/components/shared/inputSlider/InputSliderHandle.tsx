import * as React from 'react'
import styled from 'styled-components'
import { SliderItem, GetHandleProps } from 'react-compound-slider'

const Handle = ({
  domain: [min, max],
  handle: { id, value },
  className,
  getHandleProps
}: {
  domain: [number, number]
  handle: SliderItem
  disabled: boolean
  className?: string
  getHandleProps: GetHandleProps | (() => undefined)
}) => {
  return (
    <div
      role='slider'
      className={className}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      {...getHandleProps(id)}
    />
  )
}

export const InputSliderHandle = styled(Handle)`
  left: ${({ handle }: { handle: SliderItem }) => `${handle.percent}%`};
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 2;
  width: 15px;
  height: 15px;
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
  background-color: ${({ disabled }: { disabled: boolean }) => disabled ? '#666' : '#ffc400'};
`
