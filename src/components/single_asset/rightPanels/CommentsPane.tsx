import * as React from 'react'
import styled from 'styled-components'
import { getEmoji } from '@components/helpers/emojis'

const Tc = styled.span`
  font-size: 9em;
`

const Tw = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`

export const CommentsPane = () => (
  <Tw>
    <Tc role='img'>{getEmoji()}</Tc>
  </Tw>
)
