import * as React from 'react'
import { theme } from '../Theme/theme'
import styled, { css } from 'styled-components'

const LoadingOuter = styled.div`
  width: 100%;
  height: 2px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
`

const LoadingInner = styled.div<ILoading>`
  width: ${props => `${props.percentage}%`};
  background-color: ${theme.primary};
  border-radius: 0 1px 1px 0;
  box-shadow: 0 2px 8px 0 ${theme.primary};
  height: 2px;
  position: absolute;
  top: 0;
  left: 0;
  transition: all 200ms;
  ${(props: { loaded?: boolean }) =>
    props.loaded &&
    css<ILoading>`
      width: 100%;
      animation-name: loaded;
      animation-duration: 200ms;
      animation-delay: 200ms;
      animation-iteration-count: 1;
      animation-fill-mode: forwards;
      @keyframes loaded {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }
    `}
`

interface ILoading {
  percentage?: number
  loading?: boolean
  loaded?: boolean
}

export const Loading = ({ loading, loaded = false }: ILoading) => {
  const [percentage, setPercentage] = React.useState(0)

  React.useEffect(() => {
    setPercentage(20)
    const timer = setTimeout(() => setPercentage(40), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <LoadingOuter>
      <LoadingInner loading={loading} loaded={loaded} percentage={percentage} />
    </LoadingOuter>
  )
}
