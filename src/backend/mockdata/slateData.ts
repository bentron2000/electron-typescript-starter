export const staticBlurb = {
  object: 'value',
  document: {
    object: 'document',
    data: {},
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        data: {},
        nodes: [
          { object: 'text', text: 'This is a ', marks: [] },
          {
            object: 'text',
            text: 'block',
            marks: [{ object: 'mark', type: 'underlined', data: {} }]
          },
          { object: 'text', text: ' texty business...', marks: [] }
        ]
      },
      {
        object: 'block',
        type: 'paragraph',
        data: {},
        nodes: [
          {
            object: 'text',
            text:
              "When a section or element is active - its widgetty business is visible and the whole area is made separate from the background to illustrate it is a distinct block. This way, when reading, all the brief content appears like a single document. But its discrete chunkiness is illustrated clearly when in 'edit' mode.",
            marks: []
          }
        ]
      },
      {
        object: 'block',
        type: 'paragraph',
        data: {},
        nodes: [
          {
            object: 'text',
            text:
              'When hovering, the distinctions are also made, but more subtly.',
            marks: []
          }
        ]
      },
      {
        object: 'block',
        type: 'paragraph',
        data: {},
        nodes: [
          { object: 'text', text: 'An element contains ', marks: [] },
          {
            object: 'text',
            text: 'one',
            marks: [{ object: 'mark', type: 'bold', data: {} }]
          },
          { object: 'text', text: ' (for static elements), or ', marks: [] },
          {
            object: 'text',
            text: 'many',
            marks: [{ object: 'mark', type: 'bold', data: {} }]
          },
          {
            object: 'text',
            text: ' (for dynamic elements) ElementData instances. ',
            marks: []
          }
        ]
      },
      {
        object: 'block',
        type: 'paragraph',
        data: {},
        nodes: [
          {
            object: 'text',
            text: 'Each ElementData instance contains a single ',
            marks: []
          },
          {
            object: 'text',
            text: 'slate',
            marks: [{ object: 'mark', type: 'bold', data: {} }]
          },
          {
            object: 'text',
            text: ' rich content editor which can have fields placed into it.',
            marks: []
          }
        ]
      },
      {
        object: 'block',
        type: 'paragraph',
        data: {},
        nodes: [
          { object: 'text', text: 'I can ', marks: [] },
          {
            object: 'text',
            text: 'BLESS',
            marks: [{ object: 'mark', type: 'bold', data: {} }]
          },
          { object: 'text', text: ' some data to make it a ', marks: [] },
          {
            object: 'text',
            text: 'field',
            marks: [{ object: 'mark', type: 'code', data: {} }]
          },
          { object: 'text', text: '. ', marks: [] }
        ]
      },
      {
        object: 'block',
        type: 'paragraph',
        data: {},
        nodes: [
          { object: 'text', text: 'Fields have ', marks: [] },
          {
            object: 'text',
            text: 'special semantic meaning in loupe.',
            marks: [{ object: 'mark', type: 'italic', data: {} }]
          },
          {
            object: 'text',
            text:
              ' These special blocks appear in a visually distinct manner. Like an embed.',
            marks: []
          }
        ]
      },
      {
        object: 'block',
        type: 'field',
        data: {
          name: 'Field Label',
          value: 'Delete this to show validation message'
        }
      },
      {
        object: 'block',
        type: 'paragraph',
        data: {},
        nodes: [
          {
            object: 'text',
            text:
              'Fields can appear inline! They can be placed anywhere in the rich text content, and if they are defined but are not placed in the text should default to sitting at the bottom. ',
            marks: []
          }
        ]
      },
      {
        object: 'block',
        type: 'paragraph',
        data: {},
        nodes: [
          {
            object: 'text',
            text:
              'A selected field can have its options manipulated in the right hand panel. ',
            marks: []
          }
        ]
      },
      {
        object: 'block',
        type: 'paragraph',
        data: {},
        nodes: [
          {
            object: 'text',
            text:
              "(Perhaps field values can be set to 'editable' separately to the balance of the ElementData content?)",
            marks: [{ object: 'mark', type: 'italic', data: {} }]
          }
        ]
      },
      {
        object: 'block',
        type: 'paragraph',
        data: {},
        nodes: [
          { object: 'text', text: 'A field could also be a ', marks: [] },
          {
            object: 'text',
            text: 'rich text value',
            marks: [
              { object: 'mark', type: 'bold', data: {} },
              { object: 'mark', type: 'underlined', data: {} }
            ]
          },
          {
            object: 'text',
            text: ' ',
            marks: [{ object: 'mark', type: 'bold', data: {} }]
          },
          {
            object: 'text',
            text: '- but a nested rich text value cannot contain fields.',
            marks: []
          }
        ]
      }
    ]
  }
}
