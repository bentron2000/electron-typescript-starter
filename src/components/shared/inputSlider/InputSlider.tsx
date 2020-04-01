import * as React from 'react'
import styled from 'styled-components'
import { Slider, Rail, Handles, Tracks } from 'react-compound-slider'
import { InputSliderTrack } from './InputSliderTrack'
import { InputSliderHandle } from './InputSliderHandle'
import { InputSliderRail } from './InputSliderRail'

const InputSliderStyles = styled.div`
  position: relative;
  height: 0;
  width: ${(props: { width?: string }) => (props.width || '100%')};
`

export interface IInputSlider {
  min?: number
  max?: number
  defaultValue?: number
  width?: string
  reversed?: boolean
  disabled?: boolean
  className?: string
  onChange?: (value: number) => void
}

export const InputSlider = ({
  min = 0,
  max = 100,
  width = '100%',
  defaultValue = 0,
  reversed = false,
  disabled = false,
  className,
  onChange
}: IInputSlider) => {
  const domain = [min, max] as [number, number]
  const defaultValues = [defaultValue] as number[]
  const handleUpdate = (val: number[]) => {
    if (val[0] && onChange) { onChange(val[0]) }
  }

  return (
    <InputSliderStyles width={width} className={className}>
      <Slider step={1} reversed={reversed} domain={domain} values={defaultValues} onUpdate={handleUpdate}>
        <Rail>
          {({ getRailProps }) => <InputSliderRail getRailProps={disabled ? () => undefined : getRailProps} />}
        </Rail>
        <Handles>
          {({ handles, getHandleProps }) => (
            <div className='slider-handles'>
              {handles.map(handle => (
                <InputSliderHandle
                  key={handle.id}
                  className='handle'
                  handle={handle}
                  domain={domain}
                  disabled={disabled}
                  getHandleProps={disabled ? () => undefined : getHandleProps}
                />
              ))}
            </div>
          )}
        </Handles>
        <Tracks right={false}>
          {({ tracks, getTrackProps }) => (
            <div className='slider-tracks'>
              {tracks.map(({ id, source, target }) => (
                <InputSliderTrack
                  key={id}
                  className='track'
                  source={source}
                  target={target}
                  disabled={disabled}
                  getTrackProps={disabled ? () => undefined : getTrackProps}
                />
              ))}
            </div>
          )}
        </Tracks>
      </Slider>
    </InputSliderStyles>
  )
}
