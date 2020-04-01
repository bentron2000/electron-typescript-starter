import * as React from 'react'
import {
  theme,
  Heading,
  IHeading,
  Input,
  Flex,
  Icon,
  IInlineEdit2ReadViewProps,
  IInlineEdit2EditViewProps,
} from '@components/shared'
import styled, { css } from 'styled-components'

const NodeBaseStyles = css<{ selected?: boolean }>`
  margin: 3px 5px;
  border-radius: 25px;
  padding: ${`${theme.s2} ${theme.s3}`};
  color: ${props => (props.selected ? theme.primary : 'inherit')};
  border: ${props => (props.selected ? `1px solid ${theme.primary}` : 'none')};
`

const NodeHeading = styled(Heading)<ITreeNodeProps>`
  ${NodeBaseStyles} :hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`

const NodeEditableInput = styled(Input)`
  ${NodeBaseStyles}
  margin: 3px;
  background-color: ${theme.grayDarkest};
  font-size: 20px;
`

const AddNode = styled.div<IAddTreeNode>`
  position: relative;
  padding: ${theme.s2};
  font-style: italic;
  color: #4c5560;
  font-size: ${props => props.fontSize};
  cursor: pointer;
  user-select: none;

  :hover {
    color: ${theme.primary};
  }
`

const DottedLine = styled.div`
  position: absolute;
  left: -58px;
  width: 60px;
  height: 1px;
  background-color: ${theme.grayDarkest};
  border: 1px dashed #4c5560;
`

interface ITreeNodeProps extends IHeading, IInlineEdit2ReadViewProps {
  children: React.ReactNode
  selected?: boolean
}

export const TreeNode = ({ children, ...props }: ITreeNodeProps) => (
  <NodeHeading
    color={props.selected ? theme.primary : 'inherit'}
    mb='0'
    size='medium'
    {...props}
  >
    {children}
  </NodeHeading>
)

interface IEditableTreeNodeProps extends IInlineEdit2EditViewProps {
  selected?: boolean
}

export const EditableTreeNode = (props: IEditableTreeNodeProps) => (
  <NodeEditableInput {...props} />
)

interface IAddTreeNode {
  children: React.ReactNode
  fontSize?: string
  dotted?: boolean
  onClick?: () => void
}

export const AddTreeNode = ({
  children,
  dotted = false,
  fontSize = '20px',
  ...props
}: IAddTreeNode) => (
  <AddNode fontSize={fontSize} {...props}>
    <Flex align='center'>
      {dotted && <DottedLine />}
      <Icon name='add' width='32px' />
      {children}
    </Flex>
  </AddNode>
)
