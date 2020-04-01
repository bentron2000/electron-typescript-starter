import { FieldValue } from '@models'

export interface FieldDefinition {
  readonly id: string
  readonly model: string
  name: string
  elementId: string
  type: string
  instances: FieldValue[]
  defaultValue?: string
}
