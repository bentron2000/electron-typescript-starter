import * as React from 'react'
import styled, { css } from 'styled-components'
import { theme } from '../Theme/theme'
import { Text, Icon } from '../../shared'

const ImageContainer = styled.div<Asset>`
  display: flex;
  align-items: center;
  flex-grow: 1;
  max-height: 100%;
  background: url(${props => props.src}) center / contain no-repeat;
`

const AssetToolbar = styled.div`
  background-color: ${theme.grayDark};
  display: flex;
  justify-content: space-between;
  color: ${theme.grayLight};
`
const ContentBox = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

const DetailsBox = styled.div`
  position: absolute;
  background: rgba(34, 40, 52, 0.8);
  opacity: 0;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${theme.s3};
  transition: all 100ms;
`

const ConfirmedBox = styled.div`
  position: absolute;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  background: rgba(84, 194, 162, 0.6);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${theme.s3};
  transition: all 100ms;

  :hover {
    background: rgba(84, 194, 162, 0.9);
  }

  * {
    opacity: 0;
    transition: all 100ms;
  }

  :hover * {
    opacity: 1;
    transition: all 100ms;
  }
`

const ActionBox = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  border: 2px dashed rgba(255, 255, 255, 0.6);
  color: white;
  background: rgba(34, 40, 52);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${theme.s3};
  transition: all 100ms;
  opacity: 0;
  cursor: pointer;
`

const AssetContainer = styled.div<Asset>`
  background-color: #222834;
  border-radius: 2px;
  box-shadow: 0 2px 14px 0 rgba(0, 0, 0, 0.09);
  overflow: hidden;
  position: relative;
  :before {
    content: '';
    padding-bottom: 100%;
    display: inline-block;
    vertical-align: top;
  }

  :hover {
    background-color: #3A4356;
  }

  :hover ${AssetToolbar} {
    filter: brightness(1.2);
  }

  :hover ${DetailsBox} {
    opacity: 1;
  }

  :hover ${ActionBox} {
    opacity: .8;
  }

  ${(props: { selected?: boolean }) =>
    props.selected &&
    css`
      margin: -1px;
      border: 1px solid ${theme.green};
    `}

  ${(props: { isDragging?: boolean }) =>
    props.isDragging &&
    css`
      box-shadow: 0 2px 24px 0 rgba(0, 0, 0, 0.6);
      filter: brightness(1.6);
      transform: rotate(-10deg);
      transition: all 100ms;
      z-index: 100;
      :hover {
        background-color: #222834;
      }
    `}

      ${(props: { disabled?: boolean }) =>
        props.disabled &&
        css`
          opacity: 0.4;
          pointer-events: none;
        `}
`

interface Asset {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  src?: string
  selected?: boolean
  tools?: React.ReactNode
  showDetails?: boolean
  isDragging?: boolean
  disabled?: boolean
  action?: string
  actionIcon?: string
  confirmed?: React.ReactNode
  title?: string
  details?: string
}

export const Asset = (props: Asset) => {
  return (
    <AssetContainer {...props}>
      <ContentBox>
        {props.confirmed && <ConfirmedBox>{props.confirmed}</ConfirmedBox>}
        {props.action && (
          <ActionBox>
            <Icon name={props.actionIcon} width='64px' />
            <Text subtitle color='white' mb='0'>
              {props.action}
            </Text>
          </ActionBox>
        )}
        {props.showDetails && (
          <DetailsBox>
            <Text body color={theme.primary} mb={theme.s1}>
              {props.title}
            </Text>
            <Text small color={theme.grayLighter}>
              {props.details}
            </Text>
          </DetailsBox>
        )}
        <ImageContainer {...props} />
        {props.tools && <AssetToolbar>{props.tools}</AssetToolbar>}
      </ContentBox>
    </AssetContainer>
  )
}
