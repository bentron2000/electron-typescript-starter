import {
  Action,
  action,
  Thunk,
  thunk,
  Computed,
  computed,
  ThunkOn,
  thunkOn,
} from 'easy-peasy'

import { Project } from '@models/Project'
import { Stage } from '@models/Stage'
import { Section } from '@models/Section'

import { LoupeModel } from '../..'

// TODO: Use the ipc module to remove need for this
import { getSectionsByProject } from '@models/Section'

export interface BriefPart {
  all: Section[]
  sectionStages: Computed<BriefPart, (section: Section) => Stage[], LoupeModel>
  fetch: Thunk<BriefPart, Project, void, LoupeModel>
  set: Action<BriefPart, Section[]>
  clear: Action<BriefPart>
  onProjectSet: ThunkOn<BriefPart, void, LoupeModel>
}
export const briefPart: BriefPart = {
  all: [],
  sectionStages: computed(
    [(_, globalState) => globalState.project.stages.all],
    stages => section =>
      section
        ? stages.filter(stage => stage.sectionIds.includes(section.id))
        : []
  ),
  fetch: thunk((actions, payload, { getStoreState }) => {
    const state = getStoreState()
    const ctx = state.user.seats.current
    const setterCallback = (sections: Section[]) => actions.set(sections)
    if (ctx) {
      getSectionsByProject(ctx, payload.id, setterCallback)
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
