import * as React from 'react'
// import * as ReactDOM from 'react-dom'
// import styled from 'styled-components'
// import { debounce } from 'lodash'
// import Html from 'slate-html-serializer'
// import { Value, Editor as CoreEditor, Mark } from 'slate'
// import {
//   Editor,
//   RenderBlockProps,
//   EditorProps,
//   RenderMarkProps,
//   getEventTransfer,
//   RenderInlineProps,
// } from 'slate-react'

import { ElementData } from '@models/ElementData'

// import { Button, Flex, Text, theme } from '../'
// import { StringField } from '../../fields/StringField'

// import { blurb } from '../../fields/sampleData'

/**
 * --------------------------------------------------------------------------------------
 *  This component based on the 'hovermenu' example from slate.js
 *  https://github.com/ianstormtaylor/slate/blob/master/examples/hovering-menu/index.js
 * --------------------------------------------------------------------------------------
 */

// const StyledEditor = styled(Editor)<{ border?: string; color?: string }>`
//   padding: ${theme.s3};
//   border-top: ${props => props.border};
//   h1,
//   h2,
//   h3,
//   h4,
//   h5,
//   h6,
//   p,
//   label,
//   figcaption,
//   caption,
//   q,
//   blockquote,
//   code,
//   li {
//     margin: 0;
//     margin-bottom: 8px;
//     color: ${props => props.color || 'white'};
//   }
//   h1 {
//     font: 300 32px/40px ${theme.primaryFont};
//   }
//   h2 {
//     font: 300 28px/32px ${theme.primaryFont};
//   }
//   h3 {
//     font: 500 20px/28px ${theme.primaryFont};
//   }
//   h4 {
//     font: 500 18px/24px ${theme.primaryFont};
//   }
//   h5 {
//     font: 500 16px/20px ${theme.primaryFont};
//   }
//   h6 {
//     font: 500 14px/18px ${theme.primaryFont};
//   }
//   p {
//     font: 300 16px/24px ${theme.primaryFont};
//   }
//   label,
//   figcaption,
//   caption {
//     font: 500 13px/20px ${theme.primaryFont};
//     text-transform: uppercase;
//   }
//   figcaption,
//   caption {
//     color: ${theme.grayLight};
//     text-align: center;
//     font-style: italic;
//   }
//   q,
//   blockquote {
//     font: 500 20px/28px ${theme.primaryFont};
//     font-style: italic;
//     padding-left: 16px;
//     border-left: 2px solid ${theme.primary};
//     display: inherit;
//   }
//   a {
//     font-weight: 600;
//     color: white;
//     :hover {
//       color: ${theme.primary};
//     }
//   }
//   code {
//     padding: 16px;
//     font: 300 16px/24px 'Courier';
//     background-color: ${theme.grayDarker};
//     border-radius: 4px;
//     display: inherit;
//   }
//   li {
//     font: 300 16px/24px ${theme.primaryFont};
//   }
//   img {
//     max-width: 100%;
//     margin: 16px 0;
//   }
// `

// const BLOCK_TAGS = {
//   p: 'paragraph',
//   li: 'list-item',
//   ul: 'bulleted-list',
//   ol: 'numbered-list',
//   blockquote: 'quote',
//   pre: 'code',
//   h1: 'heading-one',
//   h2: 'heading-two',
//   h3: 'heading-three',
//   h4: 'heading-four',
//   h5: 'heading-five',
//   h6: 'heading-six',
// }

// const MARK_TAGS = {
//   strong: 'bold',
//   em: 'italic',
//   u: 'underline',
//   s: 'strikethrough',
//   code: 'code',
// }

// const RULES = [
//   {
//     // @ts-ignore
//     deserialize(el, next) {
//       const block = BLOCK_TAGS[el.tagName.toLowerCase()]

//       if (block) {
//         return {
//           object: 'block',
//           type: block,
//           nodes: next(el.childNodes),
//         }
//       }
//     },
//   },
//   {
//     // @ts-ignore
//     deserialize(el, next) {
//       const mark = MARK_TAGS[el.tagName.toLowerCase()]

//       if (mark) {
//         return {
//           object: 'mark',
//           type: mark,
//           nodes: next(el.childNodes),
//         }
//       }
//     },
//   },
//   {
//     // Special case for code blocks, which need to grab the nested childNodes.
//     // @ts-ignore
//     deserialize(el, next) {
//       if (el.tagName.toLowerCase() === 'pre') {
//         const code = el.childNodes[0]
//         const childNodes =
//           code && code.tagName.toLowerCase() === 'code'
//             ? code.childNodes
//             : el.childNodes

//         return {
//           object: 'block',
//           type: 'code',
//           nodes: next(childNodes),
//         }
//       }
//     },
//   },
//   {
//     // Special case for images, to grab their src.
//     // @ts-ignore
//     deserialize(el, next) {
//       if (el.tagName.toLowerCase() === 'img') {
//         return {
//           object: 'block',
//           type: 'image',
//           nodes: next(el.childNodes),
//           data: {
//             src: el.getAttribute('src'),
//           },
//         }
//       }
//     },
//   },
//   {
//     // Special case for links, to grab their href.
//     // @ts-ignore
//     deserialize(el, next) {
//       if (el.tagName.toLowerCase() === 'a') {
//         return {
//           object: 'inline',
//           type: 'link',
//           nodes: next(el.childNodes),
//           data: {
//             href: el.getAttribute('href'),
//           },
//         }
//       }
//     },
//   },
// ]

// const serializer = new Html({ rules: RULES })

// const schema = {
//   // document: {
//   //   nodes: [
//   //     {
//   //       match: [{ type: 'paragraph' }, { type: 'field' }]
//   //     }
//   //   ]
//   // },
//   blocks: {
//     // paragraph: {
//     //   nodes: [
//     //     {
//     //       match: { object: 'text' }
//     //     }
//     //   ]
//     // },
//     // field: {
//     //   isVoid: true,
//     //   data: {
//     //     name: (v: string) => !!v, // update with a real validator...
//     //     value: (v: string) => !!v // update with a real validator...
//     //   }
//     // },
//     image: {
//       isVoid: true,
//     },
//   },
// }

// interface IMenu {
//   ref: any
// }

// const Menu = styled.div<IMenu>`
//   width: 200px;
//   padding: 8px 7px 6px;
//   position: absolute;
//   z-index: 1;
//   top: -10000px;
//   left: -10000px;
//   margin-top: -6px;
//   opacity: 0;
//   background-color: #222;
//   border-radius: 4px;
//   transition: opacity 0.75s;
// `

// type MarkButton = ({
//   editor,
//   type,
//   icon, // the icon to use...
// }: {
//   editor: CoreEditor
//   type: string
//   icon: string
// }) => JSX.Element

// const MarkButton: MarkButton = ({ editor, type }) => {
//   const { value } = editor
//   const isActive = value.activeMarks.some((mark: Mark) => mark.type === type)
//   const activeProps = isActive ? { primary: true } : { secondary: true }
//   return (
//     <Button
//       {...activeProps}
//       onClick={(event: React.SyntheticEvent) => {
//         event.preventDefault()
//         editor.toggleMark(type)
//       }}
//     >
//       {type}
//     </Button>
//   )
// }

// interface IHoverMenu {
//   editor: CoreEditor
// }

// // Could potentially use the popover/tooltip we've already built...
// const HoverMenu = React.forwardRef<IMenu, IHoverMenu>(({ editor }, ref) => {
//   const root = window.document.getElementById('App') as HTMLElement // override null possibility
//   return ReactDOM.createPortal(
//     <Menu ref={ref}>
//       <Flex direction='row'>
//         <MarkButton editor={editor} type='bold' icon='upload' />
//         <MarkButton editor={editor} type='italic' icon='upload' />
//         <MarkButton editor={editor} type='underlined' icon='upload' />
//         <MarkButton editor={editor} type='code' icon='upload' />
//       </Flex>
//     </Menu>,
//     root
//   )
// })

interface IStaticElementData {
  data: ElementData
  readOnly?: boolean
  updateElementData?: (data: ElementData) => void
  border?: string
  color?: string
}

export const StaticElementData = (props: IStaticElementData) => {
  // const [value, setValue] = React.useState<Value>(
  //   Value.fromJSON(JSON.parse(props.data.value || ''))
  // )
  // const [menuRef] = React.useState(React.createRef<IMenu>()) // setter is never used. Ref created on mount passed in as init.

  // const renderEditor = (
  //   _props: EditorProps,
  //   editor: CoreEditor,
  //   next: () => any
  // ) => {
  //   const children = next()
  //   return (
  //     <React.Fragment>
  //       {children}
  //       <HoverMenu ref={menuRef} editor={editor} />
  //     </React.Fragment>
  //   )
  // }

  // const renderMark = (
  //   prp: RenderMarkProps,
  //   _editor: CoreEditor,
  //   next: () => any
  // ) => {
  //   const { children, mark, attributes } = prp
  //   switch (mark.type) {
  //     case 'bold':
  //       return <strong {...attributes}>{children}</strong>
  //     case 'code':
  //       return <code {...attributes}>{children}</code>
  //     case 'italic':
  //       return <em {...attributes}>{children}</em>
  //     case 'underlined':
  //       return <u {...attributes}>{children}</u>
  //     default:
  //       return next()
  //   }
  // }

  // const renderInline = (
  //   prp: RenderInlineProps,
  //   _editor: CoreEditor,
  //   next: () => any
  // ) => {
  //   switch (prp.node.type) {
  //     case 'link':
  //       const { data } = prp.node
  //       const href = data.get('href')
  //       return (
  //         <a href={href} {...prp.attributes}>
  //           {prp.children}
  //         </a>
  //       )
  //     default:
  //       return next()
  //   }
  // }

  // const renderBlock = (
  //   prp: RenderBlockProps,
  //   _editor: CoreEditor,
  //   next: () => any
  // ) => {
  //   switch (prp.node.type) {
  //     case 'paragraph':
  //       return (
  //         <Text body {...prp.attributes}>
  //           {prp.children}
  //         </Text>
  //       )
  //     case 'field':
  //       return (
  //         <StringField
  //           label={prp.node.data.get('name')}
  //           value={prp.node.data.get('value')}
  //           {...prp}
  //         />
  //       )
  //     case 'quote':
  //       return <blockquote {...prp.attributes}>{prp.children}</blockquote>
  //     case 'code':
  //       return (
  //         <pre>
  //           <code {...prp.attributes}>{prp.children}</code>
  //         </pre>
  //       )
  //     case 'bulleted-list':
  //       return <ul {...prp.attributes}>{prp.children}</ul>
  //     case 'heading-one':
  //       return <h1 {...prp.attributes}>{prp.children}</h1>
  //     case 'heading-two':
  //       return <h2 {...prp.attributes}>{prp.children}</h2>
  //     case 'heading-three':
  //       return <h3 {...prp.attributes}>{prp.children}</h3>
  //     case 'heading-four':
  //       return <h4 {...prp.attributes}>{prp.children}</h4>
  //     case 'heading-five':
  //       return <h5 {...prp.attributes}>{prp.children}</h5>
  //     case 'heading-six':
  //       return <h6 {...prp.attributes}>{prp.children}</h6>
  //     case 'list-item':
  //       return <li {...prp.attributes}>{prp.children}</li>
  //     case 'numbered-list':
  //       return <ol {...prp.attributes}>{prp.children}</ol>
  //     case 'image':
  //       const src = prp.node.data.get('src')
  //       return <img {...prp.attributes} src={src} />
  //     default:
  //       return next()
  //   }
  // }

  // const updateMenu = () => {
  //   const menu = menuRef.current
  //   if (!menu) {
  //     return
  //   }

  //   const { fragment, selection } = value

  //   // This commented line below is the original version...
  //   // if (selection.isBlurred || selection.isCollapsed || fragment.text === '') {
  //   if (selection.isCollapsed || fragment.text === '') {
  //     // @ts-ignore
  //     menu.removeAttribute('style')
  //     return
  //   }

  //   // Weird menu placement voodoo
  //   // I imagine we can replace this with something that works better for Loupe - something more subtle always placed in the line above the selection or something...
  //   // Not entirely sure I like the medium hover menu thing.
  //   // I would expect that this menu will become quite rich over time.
  //   const native = window.getSelection()
  //   const range = native && native.getRangeAt(0)
  //   const rect = range && range.getBoundingClientRect()
  //   // @ts-ignore
  //   menu.style.opacity = 1
  //   // @ts-ignore
  //   menu.style.top = `${rect.top + window.pageYOffset - menu.offsetHeight}px`
  //   // @ts-ignore
  //   menu.style.left = `${rect.left +
  //     window.pageXOffset -
  //     // @ts-ignore
  //     menu.offsetWidth / 2 +
  //     // @ts-ignore
  //     rect.width / 2}px`
  // }

  // const onPaste = (
  //   event: Event | React.SyntheticEvent<Element, Event>,
  //   editor: CoreEditor,
  //   next: () => any
  // ) => {
  //   const transfer = getEventTransfer(event)
  //   if (transfer.type !== 'html') {
  //     return next()
  //   }
  //   // @ts-ignore
  //   // `transfer` is not typed completely
  //   const { document } = serializer.deserialize(transfer.html)
  //   editor.insertFragment(document)
  // }
  // const updateData = (newValue: Value) => {
  //   props.data.value = JSON.stringify(newValue)
  //   if (props.updateElementData) {
  //     props.updateElementData(props.data)
  //   }
  // }
  // const debouncedUpdateData = React.useCallback(debounce(updateData, 500), [])

  // const onChange = ({ value: newValue }: { value: Value }) => {
  //   setValue(newValue)
  //   debouncedUpdateData(newValue)
  // }

  // React.useEffect(() => {
  //   updateMenu()
  // }, [value])

  return (
    <p>THERE SHOULD BE A SLATE EDITOR HERE BUT TIS BORKED</p>
    // <StyledEditor
    //   key={props.data.id}
    //   schema={schema}
    //   placeholder='Enter some text...'
    //   border={props.border}
    //   color={props.color}
    //   value={value}
    //   readOnly={props.readOnly}
    //   onChange={onChange}
    //   onPaste={onPaste}
    //   renderInline={renderInline}
    //   renderEditor={renderEditor}
    //   renderMark={renderMark}
    //   renderBlock={renderBlock}
    // />
  )
}
