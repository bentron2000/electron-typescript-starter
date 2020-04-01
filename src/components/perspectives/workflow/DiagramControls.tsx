import * as React from 'react'
import styled from 'styled-components'
import { IGraphControlProps } from 'react-digraph-bentron'
import { InputSlider, Button, Flex, theme } from '@components/shared'

const steps = 100 // Slider steps

const StyledGraphControls = styled.div`
  background: #222834;
  padding: 0px;
  border-radius: 10px;
  /* Specificity hack https://www.styled-components.com/docs/faqs#how-can-i-override-styles-with-higher-specificity */
  &&& {
    bottom: 16px;
  }
`

const Icon = styled.span`
  font-weight: bold;
  color: ${theme.grayLight};
`

const PlusIconContainer = styled.div`
  padding: 18px 10px;
  display: flex;
  margin-left: ${theme.s2};
`

const PlusIcon = styled(Icon)`
  font-size: 24px;
`

const MinusIconContainer = styled.div`
  padding: 18px 12px;
  display: flex;
  margin: 0 8px 1px 12px;
`

const MinusIcon = styled(Icon)`
  font-size: 28px;
`

const defaultProps = {
  minZoom: 0.15,
  maxZoom: 1.5,
}

export class DiagramControls extends React.Component<
  IGraphControlProps & typeof defaultProps
> {
  public static defaultProps = defaultProps

  // Convert slider val (0-steps) to original zoom value range
  public sliderToZoom(val: number) {
    const { minZoom, maxZoom } = this.props
    return (val * (maxZoom - minZoom)) / steps + minZoom
  }

  // Convert zoom val (minZoom-maxZoom) to slider range
  public zoomToSlider(val: number) {
    const { minZoom, maxZoom } = this.props
    return ((val - minZoom) * steps) / (maxZoom - minZoom)
  }

  // Modify current zoom of graph-view
  public zoom = (sliderVal: number) => {
    const { minZoom, maxZoom } = this.props
    const zoomLevelNext = this.sliderToZoom(sliderVal)
    const delta = zoomLevelNext - this.props.zoomLevel

    if (zoomLevelNext <= maxZoom && zoomLevelNext >= minZoom) {
      this.props.modifyZoom(delta)
    }
  }

  public render() {
    const min = this.zoomToSlider(this.props.minZoom)
    const max = this.zoomToSlider(this.props.maxZoom)
    const zl = Math.floor(this.zoomToSlider(this.props.zoomLevel))

    return (
      <StyledGraphControls className='graph-controls'>
        <Flex align='center'>
          <MinusIconContainer>
            <MinusIcon>-</MinusIcon>
          </MinusIconContainer>
          <InputSlider
            defaultValue={zl}
            min={min}
            max={max}
            onChange={this.zoom}
            width='120px'
          />
          <PlusIconContainer>
            <PlusIcon>+</PlusIcon>
          </PlusIconContainer>
        </Flex>
        <Button mr={theme.s2} text onClick={this.props.zoomToFit}>
          Fit
        </Button>
      </StyledGraphControls>
    )
  }
}
