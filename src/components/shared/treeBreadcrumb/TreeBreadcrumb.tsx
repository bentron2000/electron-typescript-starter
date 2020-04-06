import * as React from 'react'
import styled, { css } from 'styled-components'
import { theme } from '@components/shared/Theme/theme'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbItemButton,
  IBreadcrumbItem,
  IBreadcrumbItemContent,
  LeftDivider,
} from '@components/shared'
import { TreeDefinition } from '@models/TreeDefinition'
import { TreeInstance, tIgetBranch, tIfindById } from '@models/TreeInstance'

const selectedBcColor = theme.yellow
const bcHoverColor = '#313846'

const StyledBreadcrumb = styled(Breadcrumb)`
  margin: 10px 10px 20px 0;
`

const TreeBreadcrumbItem = styled(BreadcrumbItem)`
  background: ${theme.grayDarkest};
  :hover {
    button {
      background: ${bcHoverColor};
    }
    #Rectangle-6 {
      fill: ${bcHoverColor};
    }
  }
  // Sets the background of the next elements li container so the
  // transparent section of the SVG LeftDivider appears hovered.
  :hover + li {
    background: ${bcHoverColor};
  }
  border-radius: ${(props: IBreadcrumbItem) =>
    props.first && props.last
      ? '20px'
      : props.first
      ? '20px 0 0 20px'
      : props.last
      ? '0 20px 20px 0'
      : '0'};
  ${(props: IBreadcrumbItem) =>
    props.last &&
    css`
      :hover {
        button {
          background: ${theme.grayDarkest};
        }
        #Rectangle-6 {
          fill: #222834;
        }
      }
    `}
  ${(props: IBreadcrumbItem) => {
    return (
      props.selected &&
      css`
        #Rectangle-6 {
          fill: ${selectedBcColor};
        }
        :hover {
          button {
            background: ${selectedBcColor};
          }
          #Rectangle-6 {
            fill: ${selectedBcColor};
          }
        }
      `
    )
  }}
`

const TreeBreadcrumbItemButton = styled(BreadcrumbItemButton)`
  padding: 0 15px;
  color: #697683;
  background: ${theme.grayDarkest};
  border-radius: ${(props: IBreadcrumbItem) =>
    props.first && props.last
      ? '20px'
      : props.first
      ? '20px 0 0 20px'
      : props.last
      ? '0 20px 20px 0'
      : '0'};
  ${(props: IBreadcrumbItem) =>
    !props.first &&
    css`
      // Adjustment needed on button when <LeftDivider> SVG is rendered
      margin-top: -2px;
    `}
  ${(props: IBreadcrumbItem) =>
    props.last &&
    css`
      cursor: default;
    `}
  ${(props: IBreadcrumbItem) =>
    props.selected &&
    css`
      color: ${theme.textDark};
      background: ${selectedBcColor};
    `}
`

interface ITreeBreadcrumbItemContent extends IBreadcrumbItemContent {
  text: string
  onSelect?: () => void
}

const TreeBreadcrumbItemContent = ({
  text,
  children,
  onSelect,
  ...props
}: ITreeBreadcrumbItemContent) => {
  return (
    <>
      {!props.first && (
        <LeftDivider
          selected={props.selected}
          selectedColor={selectedBcColor}
        />
      )}
      <TreeBreadcrumbItemButton onClick={onSelect} {...props}>
        <span>{children || text}</span>
      </TreeBreadcrumbItemButton>
    </>
  )
}

export interface TreeBreadcrumb {
  rootTd: TreeDefinition | undefined
  selectedTIID: string
  setSelectedTIID: (tiId: string) => void
}

export const TreeBreadcrumb = ({
  rootTd,
  selectedTIID,
  setSelectedTIID,
}: TreeBreadcrumb) => {
  let branch: TreeInstance[] = []

  if (rootTd && selectedTIID) {
    const rootTi = rootTd.instances[0]
    branch = tIgetBranch(rootTi, tIfindById(rootTi, selectedTIID)[0])
  }

  const handleSelect = (id: string) =>
    setSelectedTIID(selectedTIID === id ? '' : id)

  const renderNode = (ti: TreeInstance, i: number): JSX.Element | false => {
    return (
      i > 0 && (
        <TreeBreadcrumbItem key={ti.id} selected={i === branch.length - 1}>
          {(props: IBreadcrumbItemContent) => (
            <TreeBreadcrumbItemContent
              text={ti.name as string}
              onSelect={() => !props.last && handleSelect(ti.id)}
              {...props}
            />
          )}
        </TreeBreadcrumbItem>
      )
    )
  }

  return (
    <>
      <StyledBreadcrumb>
        {branch.map(renderNode).filter(x => x)}
      </StyledBreadcrumb>
    </>
  )
}
