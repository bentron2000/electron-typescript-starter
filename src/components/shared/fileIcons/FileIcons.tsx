import * as React from 'react'
import styled, { css } from 'styled-components'
import { Icon, Box } from '@components/shared'

const formatSizes = {
  font: { small: '12px/16px', medium: '15px/16px', large: '22px/26px' },
  width: { small: '36px', medium: '42px', large: '64px' },
}

const FormatBox = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`

const FormatName = styled.p<Pick<IFileIcon, 'size'>>`
  position: relative;
  text-transform: uppercase;
  color: white;
  text-align: center;
  user-select: none;
  left: -3px;
  ${({ size = 'small' }) =>
    css`
      font: 800 ${formatSizes.font[size]} 'proxima-nova', Helvetica, Arial,
        sans-serif;
    `}
`
interface IFileIcon {
  format?: string
  color?: string
  size?: 'small' | 'medium' | 'large'
}

export const FileIcon = ({ format, color, size = 'small' }: IFileIcon) => {
  const trimName = format && format.substring(0, 3)

  return (
    <Box color={color}>
      <FormatBox>
        <FormatName size={size}>{trimName}</FormatName>
      </FormatBox>
      <Icon width={formatSizes.width[size]} name='file' />
    </Box>
  )
}
