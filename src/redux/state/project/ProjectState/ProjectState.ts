import { Action, action, Thunk, thunk, ActionOn, actionOn } from 'easy-peasy'

import { ipcSubscribe, ipcCreate } from '@redux/ipc'
import { LoupeModel } from '@redux/state'
import { Project } from '@models'

import { briefPart, BriefPart } from '../BriefPart/BriefPart'
import { stagePart, StagePart } from '../StagePart/StagePart'
import { treePart, TreePart } from '../TreePart/TreePart'
import { LoupeRealmResponse, LoupeRealmErrorResponse } from '@models/ipc'
import { SaveTemplatePayload } from '@models'
import { NewProjectOptions } from '@models/Project'

export interface ProjectState {
  current: Project | undefined
  set: Action<ProjectState, Project>
  fetch: Thunk<ProjectState, string, void, LoupeModel>
  create: Thunk<
    ProjectState,
    NewProjectOptions,
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
  clearOnTeamSet: ActionOn<ProjectState, LoupeModel>
  saveTemplate: Thunk<
    ProjectState,
    SaveTemplatePayload,
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
  clear: Action<ProjectState>
  briefs: BriefPart
  tree: TreePart
  stages: StagePart
}

export const project: ProjectState = {
  current: undefined,
  set: action((state, payload) => {
    state.current = payload
  }),
  fetch: thunk(async (actions, projectId, { getStoreState }) => {
    const state = await getStoreState()
    const ctx = state.user.seats.current
    const currentProject = state.project.current
    const unsubId = currentProject ? currentProject.id : undefined
    const setterCallback = (prj: Project) => actions.set(prj)
    if (ctx) {
      ipcSubscribe(ctx, projectId, setterCallback, unsubId, 'Project')
    }
  }),
  create: thunk((_actions, payload, { getStoreState, getStoreActions }) => {
    return new Promise((resolve, reject) => {
      const ctx = getStoreState().user.seats.current
      if (!ctx) {
        const e = {
          status: 'error',
          message: 'No current context to create project within',
        }
        console.error(e)
        return reject(e as LoupeRealmErrorResponse)
      }
      ipcCreate(ctx, payload, 'Project', (_event, response) => {
        console.log('Created new project')
        response.status === 'success' ? resolve(response) : reject(response)
        getStoreActions().user.user.refetchUser() // Refresh current user perms
      })
    })
  }),
  clear: action(state => {
    state.current = undefined
  }),
  briefs: briefPart,
  tree: treePart,
  stages: stagePart,
  clearOnTeamSet: actionOn(
    (_, storeActions) => storeActions.user.teams.set,
    state => (state.current = undefined)
  ),
  saveTemplate: thunk((_actions, payload, { getStoreState }) => {
    return new Promise((resolve, reject) => {
      const ctx = getStoreState().user.seats.current
      if (!ctx) {
        const e = {
          status: 'error',
          message: 'No current context to create template within',
        }
        console.error(e)
        return reject(e as LoupeRealmErrorResponse)
      }
      ipcCreate(ctx, payload, 'Template', (_event, response) => {
        console.log('Created new template')
        response.status === 'success' ? resolve(response) : reject(response)
      })
    })
  }),
}
