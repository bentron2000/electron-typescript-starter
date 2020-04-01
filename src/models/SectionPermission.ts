import { Stage, Section } from './'

export interface SectionPermission {
  readonly id: string
  readonly model: string
  stage: Stage
  section: Section
  seatId: string
}
