export interface FieldValue {
  readonly id: string
  readonly model: string
  name: string
  definitionId: string
  elementDataId?: string
  value: string // as above...
}
