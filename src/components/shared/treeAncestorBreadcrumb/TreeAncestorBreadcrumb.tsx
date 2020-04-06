import * as React from 'react'
import pluralize from 'pluralize'
import styled from 'styled-components'
import {
  Flex,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  IBreadcrumbItemContent,
  BreadcrumbItemButton,
  Text,
} from '@components/shared'
import { TreeDefinition } from '@models/TreeDefinition'
import { TreeInstance, tIgetName } from '@models/TreeInstance'
import { theme } from '@components/shared/Theme/theme'

const TreeAncestorBreadcrumbItem = styled(BreadcrumbItem)`
  height: auto;
  max-height: auto;
`

const TooltipBreadcrumbItem = styled(BreadcrumbItem)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  text-align: center;
  border-top: 1px solid ${theme.grayLightest};
`

const ToolCrumbFlex = styled(Flex)`
  li:nth-of-type(1) {
    border-top: none;
  }
`

const TreeAncestorBreadcrumbItemContentText = styled.span`
  letter-spacing: 0.4px;
  text-transform: uppercase;
  font: 500 13px/20px ${theme.primaryFont};
  text-transform: uppercase;
  letter-spacing: 1.8px;
  color: ${props => props.color};
`

interface TreeAncestorBreadcrumb {
  rootTd: TreeDefinition
  selectedTd: TreeDefinition
  branch: TreeInstance[]
  shortText?: boolean
  bcItemWidthBuffer?: number
}

const TreeAncestorBreadcrumbItemContent = (
  props: IBreadcrumbItemContent & { text: string }
) => {
  return (
    <>
      <BreadcrumbItemButton {...props}>
        <TreeAncestorBreadcrumbItemContentText
          color={props.last ? 'white' : theme.textLight}
        >
          {props.children || props.text}
        </TreeAncestorBreadcrumbItemContentText>
      </BreadcrumbItemButton>
      <span style={{ color: theme.textLight }}>
        {!props.last ? '/\u00A0' : ''}
      </span>
    </>
  )
}

export const TreeAncestorBreadcrumb = ({
  rootTd,
  selectedTd,
  branch,
  shortText = false,
  bcItemWidthBuffer,
}: TreeAncestorBreadcrumb) => {
  const renderBcNode = (ti: TreeInstance, i: number) => {
    return (
      (selectedTd.parentId === rootTd.id || i > 0) && (
        <TreeAncestorBreadcrumbItem
          key={ti.id}
          maxWidthBuffer={bcItemWidthBuffer}
        >
          {(props: IBreadcrumbItemContent) => {
            const tiName = tIgetName(ti) || ''
            const text =
              props.first && shortText
                ? `in ${tiName}`
                : props.first
                ? `${pluralize(selectedTd.name)} in ${tiName}`
                : tiName
            return <TreeAncestorBreadcrumbItemContent text={text} {...props} />
          }}
        </TreeAncestorBreadcrumbItem>
      )
    )
  }

  const renderTooltipNode = (ti: TreeInstance, i: number) => {
    return (
      (selectedTd.parentId === rootTd.id || i > 0) && (
        <TooltipBreadcrumbItem key={ti.id}>
          {() => {
            const text = `${ti.name} /\u00A0\n` || ''
            return (
              <Flex align='center' justify='center'>
                <Text align='center' subtitle color={theme.grayLight} mb='0'>
                  {text}
                </Text>
              </Flex>
            )
          }}
        </TooltipBreadcrumbItem>
      )
    )
  }

  return (
    <Tooltip
      padding='0'
      onHover
      width={200}
      content={
        <ToolCrumbFlex direction='column'>
          {branch.map(renderTooltipNode)}
        </ToolCrumbFlex>
      }
    >
      <Breadcrumb>{branch.map(renderBcNode)}</Breadcrumb>
    </Tooltip>
  )
}
