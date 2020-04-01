import * as React from 'react'
import styled from 'styled-components'
import { GetRailProps } from 'react-compound-slider'

const RailOuter = styled.div`
  position: absolute;
  width: 100%;
  height: 42px;
  transform: translate(0%, -50%);
  border-radius: 7px;
  cursor: pointer;
`

const RailInner = styled.div`
  position: absolute;
  width: 100%;
  height: 8px;
  transform: translate(0%, -50%);
  border-radius: 7px;
  pointer-events: none;
  background-color: #3B424F;
`

export const InputSliderRail = ({ getRailProps }: { getRailProps: GetRailProps | (() => undefined) }) => {
  return (
    <>
      <RailOuter {...getRailProps()} />
      <RailInner />
    </>
  )
}
