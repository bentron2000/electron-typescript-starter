import * as React from 'react'
import { theme } from '../Theme/theme'

interface ILeftDivider {
  width?: string
  height?: string
  selected?: boolean
  selectedColor?: string
  color?: string
}

export const LeftDivider = ({
  width = '27px',
  height = '41px',
  selected = false,
  color = '#222834',
  selectedColor,
}: ILeftDivider) => {
  selectedColor = selectedColor || color
  return (
    <svg width={width} height={height} viewBox='0 0 27 41'>
      <g id='UI' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
        <g
          id='Assets-Empty-Repo-Set'
          transform='translate(-390.000000, -395.000000)'
        >
          <g id='divider-left' transform='translate(390.000000, 393.000000)'>
            <polygon
              id='Rectangle-6'
              fill={selected ? selectedColor : color}
              points='26 2.05590567 27 2.05590567 27 42.0559057 2 42.0559057'
            />
            <polygon
              id='Rectangle-7-Copy-4'
              fill={theme.grayDarker}
              transform='translate(13.470795, 22.055906) rotate(30.000000) translate(-13.470795, -22.055906) '
              points='12.5370509 -0.467762238 15.136846 -2 14.4028206 44.5805867 11.8047443 46.1118113'
            />
          </g>
        </g>
      </g>
    </svg>
  )
}
