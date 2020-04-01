import {
  Action,
  Thunk,
  action,
  thunk,
  computed,
  Computed,
  thunkOn,
  ThunkOn,
} from 'easy-peasy'
import { Project, Stage, Section } from '@models'
import { LoupeModel } from '@redux/state'
import { getStagesByProject } from '@models/Stage'

export interface StagePart {
  all: Stage[]
  stageSections: Computed<StagePart, (stageId: string) => Section[], LoupeModel>
  current: Stage | undefined
  setCurrent: Action<StagePart, Stage>
  fetch: Thunk<StagePart, Project, void, LoupeModel>
  set: Action<StagePart, Stage[]>
  clear: Action<StagePart>
  onProjectSet: ThunkOn<StagePart, void, LoupeModel>
}

export const stagePart: StagePart = {
  all: [],
  stageSections: computed(
    [
      (_state, globalState) => globalState.project.stages.all,
      (_state, globalState) => globalState.project.briefs.all,
    ],
    (stages, sections) => stageId => {
      const stage = stages.find(s => s.id === stageId)
      return stage
        ? sections.filter(section => stage.sectionIds.includes(section.id))
        : []
    }
  ),
  current: undefined,
  setCurrent: action((state, payload) => {
    state.current = payload
  }),
  fetch: thunk((actions, payload, { getStoreState }) => {
    const ctx = getStoreState().user.seats.current
    const setter = (stages: Stage[]) => actions.set(stages)
    if (ctx) {
      getStagesByProject(ctx, payload.id, setter)
    }
  }),
  set: action((state, payload) => {
    state.all = payload
  }),
  clear: action(state => {
    state.all = []
  }),
  onProjectSet: thunkOn(
    (_, storeActions) => storeActions.project.set,
    (actions, target) => actions.fetch(target.payload)
  ),
}
