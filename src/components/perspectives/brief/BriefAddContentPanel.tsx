import * as React from 'react'
import styled from 'styled-components'
import { theme } from '../../shared/Theme/theme'
import { Flex, AddButton, Tooltip, ITooltip } from '../../shared'
import { delayMouseOver } from '@components/helpers/delayMouseOver'

interface RowProps extends Omit<BriefAddContentPanel, 'text' | 'onClick'> {
  hovered?: boolean
}

const Row = styled(Flex)<RowProps>`
  cursor: pointer;
  min-height: ${props => props.minHeight || '16px'};
  height: min-content;
  /* Boost size of hover element when hovered for better usability*/
  padding: ${props => props.hovered && '7.5px 0'};
`

const LineBreak = styled.div<{ tooltipOpen: boolean }>`
  flex: 1;
  width: 100%;
  height: 1px;
  border-bottom: 1px solid
    ${props => (props.tooltipOpen ? theme.yellow : theme.textLight)};
  transition: all 0.5s ${theme.easeOut};
`

interface BriefAddContentPanel {
  text: string
  onClick?: () => void
  hovered?: boolean
  tooltipContent?: React.ReactElement<any>
  tooltipProps?: Partial<ITooltip>
  minHeight?: string
}

export const BriefAddContentPanel = ({
  text,
  tooltipContent,
  minHeight = '16px',
  tooltipProps,
  ...props
}: BriefAddContentPanel) => {
  const [hovered, setHover] = React.useState(false)
  const [tooltipOpen, setTooltipOpen] = React.useState(false)
  const childProps = { hovered, tooltipOpen, minHeight, ...props }

  const buttonColor = tooltipOpen ? theme.yellow : undefined
  const handleHover = (hvr: boolean) => !tooltipOpen && setHover(hvr)
  const closeTooltip = () => {
    setTooltipOpen(false)
    setHover(false)
  }

  // Bind a prop to close the tooltip to BriefAddContentPanel.tooltipContent
  if (tooltipContent) {
    tooltipContent = React.cloneElement(tooltipContent, { closeTooltip })
  }

  return (
    <div
      ref={node =>
        delayMouseOver(node as HTMLElement, handleHover.bind(null, true), 300)
      }
      onMouseLeave={() => handleHover(false)}
    >
      <Row align='center' justify='center' hovered={hovered} {...childProps}>
        {(hovered || tooltipOpen) && (
          <>
            <LineBreak tooltipOpen={childProps.tooltipOpen} />
            {tooltipContent ? (
              <Tooltip
                content={tooltipContent}
                onOpen={() => setTooltipOpen(true)}
                onClose={closeTooltip}
                {...tooltipProps}
              >
                <AddButton color={buttonColor} activeColor={theme.yellow}>
                  {text}
                </AddButton>
              </Tooltip>
            ) : (
              <AddButton color={buttonColor} activeColor={theme.yellow}>
                {text}
              </AddButton>
            )}
            <LineBreak tooltipOpen={childProps.tooltipOpen} />
          </>
        )}
      </Row>
    </div>
  )
}
