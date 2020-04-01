export interface StageTransition {
  readonly id: string
  readonly model: string
  name: string
  sourceStageId: string
  destinationStageId: string
}
