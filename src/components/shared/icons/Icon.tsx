import * as React from 'react'
import {
  MenuRight,
  MenuLeft,
  Message,
  Envelope,
  RightArrow,
  Workflow,
  Assets,
  Brief,
  Tree,
  Chevron,
  Search,
  PlusLarge,
  More,
  CloseLarge,
  Tick,
  Add,
  Close,
  Edit,
  Back,
  Upload,
  Download,
  CloseSmall,
  List,
  Grid,
  Export,
  Comment,
  Input,
  Collaborate,
  Duplicate,
  Filter,
  Rate,
  Image,
  Plus,
  StaticElement,
  FieldsetElement,
  Collapse,
  Expand,
  BlankStage,
  ShootStage,
  SelectStage,
  BriefStage,
  MarkupStage,
  SubworkflowStage,
  InputStage,
  OutputStage,
  NineGrid,
  TickLarge,
  Node,
  TickSmall,
  Positive,
  Negative,
  Informative,
  Eye,
  File,
  MoreRight,
} from './SVG'

interface IIcon {
  name?: string
  width?: string
  fill?: string
}

// SVG Switcher

export const Icon = (props: IIcon) => {
  switch (props.name) {
    // UI Icons

    case 'message':
      return <Message {...props} />
    case 'envelope':
      return <Envelope {...props} />
    case 'right-arrow':
      return <RightArrow {...props} />
    case 'workflow':
      return <Workflow {...props} />
    case 'assets':
      return <Assets {...props} />
    case 'brief':
      return <Brief {...props} />
    case 'tree':
      return <Tree {...props} />
    case 'node':
      return <Node {...props} />
    case 'menu-right':
      return <MenuRight {...props} />
    case 'menu-left':
      return <MenuLeft {...props} />
    case 'chevron':
      return <Chevron {...props} />
    case 'search':
      return <Search {...props} />
    case 'plus-large':
      return <PlusLarge {...props} />
    case 'more':
      return <More {...props} />
    case 'close-large':
      return <CloseLarge {...props} />
    case 'tick':
      return <Tick {...props} />
    case 'add':
      return <Add {...props} />
    case 'close':
      return <Close {...props} />
    case 'edit':
      return <Edit {...props} />
    case 'back':
      return <Back {...props} />
    case 'upload':
      return <Upload {...props} />
    case 'download':
      return <Download {...props} />
    case 'close-small':
      return <CloseSmall {...props} />
    case 'list':
      return <List {...props} />
    case 'grid':
      return <Grid {...props} />
    case 'input':
      return <Input {...props} />
    case 'comment':
      return <Comment {...props} />
    case 'export':
      return <Export {...props} />
    case 'collaborate':
      return <Collaborate {...props} />
    case 'duplicate':
      return <Duplicate {...props} />
    case 'filter':
      return <Filter {...props} />
    case 'rate':
      return <Rate {...props} />
    case 'image':
      return <Image {...props} />
    case 'plus':
      return <Plus {...props} />
    case 'static-element':
      return <StaticElement {...props} />
    case 'fieldset-element':
      return <FieldsetElement {...props} />
    case 'collapse':
      return <Collapse {...props} />
    case 'expand':
      return <Expand {...props} />
    case 'more-right':
      return <MoreRight {...props} />
    case 'ninegrid':
      return <NineGrid {...props} />
    case 'tick-large':
      return <TickLarge {...props} />
    case 'tick-sml':
      return <TickSmall {...props} />
    case 'positive':
      return <Positive {...props} />
    case 'negative':
      return <Negative {...props} />
    case 'informative':
      return <Informative {...props} />
    case 'eye':
      return <Eye {...props} />
    case 'file':
      return <File {...props} />

    // Stage Icons

    case 'Shoot Stage':
      return <ShootStage {...props} />
    case 'Blank Stage':
      return <BlankStage {...props} />
    case 'Shoot Stage':
      return <ShootStage {...props} />
    case 'Select Stage':
      return <SelectStage {...props} />
    case 'Subworkflow Stage':
      return <SubworkflowStage {...props} />
    case 'Brief Stage':
      return <BriefStage {...props} />
    case 'Markup Stage':
      return <MarkupStage {...props} />
    case 'Output Stage':
      return <OutputStage {...props} />
    case 'Input Stage':
      return <InputStage {...props} />
    default:
      return null
  }
}
