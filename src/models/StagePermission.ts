import { Stage } from '@models/Stage'

export interface StagePermission {
  readonly id: string
  readonly model: string
  seatId: string
  stage: Stage
  observe?: boolean
  interact?: boolean
}
