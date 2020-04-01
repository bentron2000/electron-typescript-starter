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
import { Project, TreeDefinition, TreeInstance } from '@models'
import { LoupeModel } from '@redux/state'
import { tDfindById, getRootTdByProject } from '@models/TreeDefinition'
import { ipcGet, ipcUpdate } from '@redux/ipc'
import { tIfindById } from '@models/TreeInstance'
import { RequireAtLeast } from '@helpers/typeScriptHelpers'
import { LoupeRealmResponse } from '@models/ipc'

export interface TreePart {
  rootTD: TreeDefinition | undefined
  rootTI: Computed<TreePart, TreeInstance | undefined, LoupeModel>
  getTD: Computed<
    TreePart,
    (id: string) => TreeDefinition | undefined,
    LoupeModel
  >
  getTI: Computed<
    TreePart,
    (id: string) => TreeInstance | undefined,
    LoupeModel
  >
  fetch: Thunk<TreePart, Project, void, LoupeModel>
  fetchTI: Thunk<TreePart, string, void, LoupeModel>
  set: Action<TreePart, TreeDefinition>
  setTI: Action<TreePart, TreeInstance>
  clear: Action<TreePart>
  updateTreeInstance: Thunk<
    TreePart,
    RequireAtLeast<Partial<TreeInstance>, 'id'>,
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
  onProjectSet: ThunkOn<TreePart, void, LoupeModel>
  onChangeTi: ThunkOn<TreePart, void, LoupeModel>
}

export const treePart: TreePart = {
  rootTD: undefined,
  rootTI: computed([state => state.rootTD], rootTD =>
    rootTD ? rootTD.instances[0] : undefined
  ),
  getTD: computed([state => state.rootTD], rootTD => id => {
    const tds = rootTD ? tDfindById(rootTD, id) : undefined
    return tds && tds.length ? tds[0] : undefined
  }),
  getTI: computed([state => state.rootTI], rootTI => id => {
    const ti = rootTI
    const tis = ti ? tIfindById(ti, id) : undefined
    return tis && tis.length ? tis[0] : undefined
  }),
  fetch: thunk((actions, payload, { getStoreState, getStoreActions }) => {
    const ctx = getStoreState().user.seats.current
    const setter = (rootTD: TreeDefinition) => {
      actions.set(rootTD)
      // Update the currentTd with the latest data
      const currentTd = getStoreState().treePerspective.td.current
      if (currentTd) {
        getStoreActions().treePerspective.td.set(
          tDfindById(rootTD, currentTd.id)[0]
        )
      }
    }
    getRootTdByProject(ctx, payload.id, setter)
  }),
  set: action((state, payload) => {
    state.rootTD = payload
  }),
  fetchTI: thunk((actions, payload, { getStoreState }) => {
    const ctx = getStoreState().user.seats.current
    return new Promise((resolve, reject) => {
      ipcGet(ctx, payload, 'TreeInstance', (_, response) => {
        if (response.status === 'success') {
          actions.setTI(response.data)
          resolve(response)
        } else {
          reject(response)
        }
      })
    })
  }),
  setTI: action((state, payload) => {
    if (state.rootTD) {
      const rootTI = state.rootTD.instances[0]
      if (rootTI) {
        const ti = tIfindById(rootTI, payload.id)[0]
        if (ti) {
          ti.elements = payload.elements
        }
      }
    }
  }),
  clear: action(state => {
    state.rootTD = undefined
  }),
  updateTreeInstance: thunk((_, payload, { getStoreState }) => {
    return new Promise((resolve, reject) => {
      const ctx = getStoreState().user.seats.current
      ipcUpdate(ctx, payload, 'TreeInstance', (event, response) => {
        console.log('Update Tree Instance stuff happened!', event, response)
        response.status === 'success' ? resolve(response) : reject(response)
      })
    })
  }),
  onProjectSet: thunkOn(
    (_, storeActions) => storeActions.project.set,
    (actions, target) => actions.fetch(target.payload)
  ),
  onChangeTi: thunkOn(
    (_, storeActions) => [
      storeActions.treePerspective.ti.create,
      storeActions.treePerspective.ti.delete,
      storeActions.briefPerspective.element.updateRelevance,
    ],
    (actions, _target, { getStoreState }) => {
      const proj = getStoreState().project.current
      if (proj) {
        actions.fetch(proj)
      }
    }
  ),
}
