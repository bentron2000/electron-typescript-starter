import { TemplateInfo } from '@models/Template'

export interface Team {
  readonly id: string
  readonly model: string
  name: string
  seatIds: string[]
  projectIds: string[]
  ownerIds: string[]
  adminIds: string[]
  templates: TemplateInfo[]
}
