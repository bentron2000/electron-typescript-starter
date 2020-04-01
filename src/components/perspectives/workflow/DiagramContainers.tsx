import styled, { css } from 'styled-components'

interface IStageContainer {
  selected: boolean
  hover: boolean
  linked: boolean
  color: string
}

export const StageContainer = styled.div<IStageContainer>`
  background: #373e49;
  color: white;
  font-size: 18px;
  font-weight: thin;
  border-radius: 8px;
  transition: none;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.16);
  position: relative;
  display: flex;
  align-items: center;
  min-width: 200px;
  cursor: -webkit-grab;

  ${props => props.selected && css`
    background: ${props.color};
    border: 1px solid white;
  `}

  ${props => (props.hover || props.linked) && css`
    border: 1px solid white;
  `}
`

export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 13px;
  border-radius: 6px 0 0 6px;
  color: white;
  background: ${props => props.color};
`

export const TransContainer = styled.div<StageNodeStyles>`
  position: absolute;
  width: 100%;
  height: 10px;
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  filter: brightness(125%);
  cursor: pointer;
  transition: 0.4s cubic-bezier(0.8, 0.8, 0.2, 1);
  &:hov {
    opacity: 1;
    transition: 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  ${(props: { left?: boolean }) =>
    props.left &&
    css<StageNodeStyles>`
      top: 0;
      left: 0;
      width: 10px;
      height: 100%;
    `}
  ${(props: { right?: boolean }) =>
    props.right &&
    css<StageNodeStyles>`
      top: 0;
      right: 0;
      width: 10px;
      height: 100%;
    `}
  ${(props: { top?: boolean }) =>
    props.top &&
    css<StageNodeStyles>`
      top: 0;
      left: 0;
    `}
  ${(props: { bottom?: boolean }) =>
    props.bottom &&
    css<StageNodeStyles>`
      bottom: 0;
      left: 0;
    `}
`

export const TransAdd = styled.div<StageNodeStyles>`
  background: white;
  border-radius: 100%;
  border: 1px solid ${props => props.color};
  height: 24px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 16px;
  font-size: 26px;

  span {
    color: ${props => props.color};
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: 2px;
    font-weight: bold;
  }
  ${props =>
    props.left && css`
      left: -13px;
    `}
    ${props =>
    props.right && css`
      right: -13px;
    `}
`

export interface StageNodeStyles {
  color?: string
  left?: boolean
  top?: boolean
  right?: boolean
  bottom?: boolean
}
