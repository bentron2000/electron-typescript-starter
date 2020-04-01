import { Project } from './'

export interface ProjectPermission {
  readonly id: string
  readonly model: string
  seatId: string
  project: Project
  admin?: boolean
  edit?: boolean
  delete?: boolean
}
