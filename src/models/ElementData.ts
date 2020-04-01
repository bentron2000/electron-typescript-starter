import { FieldValue } from '.'

export interface ElementData {
  readonly id: string
  readonly model: string
  name: string
  value: string // TODO: ReType this as a slate document.
  fields: FieldValue[]
  treeInstanceIds: string[]
  elementId: string
}

export function buildElementData(ed: Partial<ElementData>): ElementData {
  return {
    id: '',
    model: 'ElementData',
    name: '',
    value: '',
    fields: [],
    treeInstanceIds: [],
    elementId: '',
    ...ed
  }
}
