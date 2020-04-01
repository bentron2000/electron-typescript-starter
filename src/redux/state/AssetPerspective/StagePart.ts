import {
  Action,
  action,
  Computed,
  computed,
  actionOn,
  ActionOn,
} from 'easy-peasy'
import { Stage } from '@models'
import { LoupeModel } from '..'

export interface StagePart {
  currentStageId: string | undefined
  current: Computed<StagePart, Stage | undefined, LoupeModel>
  set: Action<StagePart, string>
  onStageSet: ActionOn<StagePart, LoupeModel>
}

export const stagePart: StagePart = {
  currentStageId: undefined,
  current: computed(
    [
      state => state.currentStageId,
      (_, storeState) => storeState.project.stages.all,
    ],
    (id, stages) =>
      id ? stages.find(s => s.id === id) || stages[0] : undefined
  ),
  set: action((state, payload) => {
    state.currentStageId = payload
  }),
  onStageSet: actionOn(
    (_, storeActions) => storeActions.project.stages.set,
    (state, target) => {
      // When stages are fetched, if we don't have a current stage set, set the first one
      target.payload.filter(s => s.id === state.currentStageId).length === 0
        ? (state.currentStageId = target.payload[0].id)
        : (state.currentStageId = undefined)
    }
  ),
}
