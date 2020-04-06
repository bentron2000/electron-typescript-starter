import { Action, action, thunk, Thunk } from 'easy-peasy'

import { TreeDefinition } from '@models/TreeDefinition'
import { TreeInstance } from '@models/TreeInstance'
import { SaveTemplatePayload } from '@models/Template'
import { LoupeRealmResponse } from '@models/ipc'

import { LoupeModel } from '@redux/state'
import { IRhpState, filterRhpPayload } from '@redux/state/helpers/rhpState'
import { ipcUpdate, ipcDelete, ipcCreate } from '@redux/ipc'

/**
 * --------------------------------------------------
 *  TREE PERSPECTIVE STATE
 * --------------------------------------------------
 */

interface RhpPart {
  settings: IRhpState
  setSettings: Action<RhpPart, IRhpState>
  files: IRhpState
  setFiles: Action<RhpPart, IRhpState>
  staticElements: IRhpState
  setStaticElements: Action<RhpPart, IRhpState>
  fieldsetElements: IRhpState
  setFieldsetElements: Action<RhpPart, IRhpState>
  setAllUnlocked: Action<RhpPart>
}

interface TdPart {
  current: TreeDefinition | undefined
  set: Action<TdPart, TreeDefinition>
  clear: Action<TdPart>
  create: Thunk<
    TdPart,
    TreeDefinition,
    void,
    LoupeModel,
    Promise<LoupeRealmResponse<TreeDefinition>>
  >
  update: Thunk<
    TdPart,
    TreeDefinition,
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
  delete: Thunk<
    TdPart,
    string | string[],
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
}

interface TiPart {
  current: TreeInstance | undefined
  set: Action<TiPart, TreeInstance>
  clear: Action<TiPart>
  create: Thunk<
    TiPart,
    TreeInstance,
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
  update: Thunk<
    TiPart,
    TreeInstance,
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
  delete: Thunk<
    TiPart,
    string | string[],
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
}

interface TemplatePart {
  saveTreeTemplate: Thunk<
    TemplatePart,
    SaveTemplatePayload,
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
}

export interface TreePerspectiveState {
  rhp: RhpPart
  td: TdPart
  ti: TiPart
  template: TemplatePart
}

export const treePerspective: TreePerspectiveState = {
  rhp: {
    settings: {},
    setSettings: action((state, payload) => {
      state.settings = {
        ...state.settings,
        ...filterRhpPayload(state.settings.locked, payload),
      }
    }),
    files: {},
    setFiles: action((state, payload) => {
      state.files = {
        ...state.files,
        ...filterRhpPayload(state.files.locked, payload),
      }
    }),
    staticElements: {},
    setStaticElements: action((state, payload) => {
      state.staticElements = {
        ...state.staticElements,
        ...filterRhpPayload(state.staticElements.locked, payload),
      }
    }),
    fieldsetElements: {},
    setFieldsetElements: action((state, payload) => {
      state.fieldsetElements = {
        ...state.fieldsetElements,
        ...filterRhpPayload(state.fieldsetElements.locked, payload),
      }
    }),
    setAllUnlocked: action(state => {
      Object.keys(state).forEach(key => (state[key].locked = undefined))
    }),
  },
  td: {
    current: undefined,
    set: action((state, payload) => {
      state.current = payload
    }),
    clear: action(state => {
      state.current = undefined
    }),
    create: thunk((_, payload, { getStoreState }) => {
      return new Promise((resolve, reject) => {
        const ctx = getStoreState().user.seats.current
        ipcCreate(ctx, payload, 'TreeDefinition', (event, response) => {
          console.log('Create TreeDefinition stuff happened!', event, response)
          response.status === 'success' ? resolve(response) : reject(response)
        })
      })
    }),
    update: thunk((_, payload, { getStoreState }) => {
      return new Promise((resolve, reject) => {
        const ctx = getStoreState().user.seats.current
        ipcUpdate(ctx, payload, 'TreeDefinition', (event, response) => {
          console.log('Update TreeDefinition stuff happened!', event, response)
          response.status === 'success' ? resolve(response) : reject(response)
        })
      })
    }),
    delete: thunk((_, payload, { getStoreState }) => {
      return new Promise((resolve, reject) => {
        const ctx = getStoreState().user.seats.current
        ipcDelete(ctx, payload, 'TreeDefinition', (event, response) => {
          console.log('Delete TreeDefinition stuff happened!', event, response)
          response.status === 'success' ? resolve(response) : reject(response)
        })
      })
    }),
  },
  ti: {
    current: undefined,
    set: action((state, payload) => {
      state.current = payload
    }),
    clear: action(state => {
      state.current = undefined
    }),
    create: thunk((_, payload, { getStoreState }) => {
      return new Promise((resolve, reject) => {
        const ctx = getStoreState().user.seats.current
        ipcCreate(ctx, payload, 'TreeInstance', (event, response) => {
          console.log('Create TreeInstance stuff happened!', event, response)
          response.status === 'success' ? resolve(response) : reject(response)
        })
      })
    }),
    update: thunk((_, payload, { getStoreState }) => {
      return new Promise((resolve, reject) => {
        const ctx = getStoreState().user.seats.current
        ipcUpdate(ctx, payload, 'TreeInstance', (event, response) => {
          console.log('Update TreeInstance stuff happened!', event, response)
          response.status === 'success' ? resolve(response) : reject(response)
        })
      })
    }),
    delete: thunk((_, payload, { getStoreState }) => {
      return new Promise((resolve, reject) => {
        const ctx = getStoreState().user.seats.current
        ipcDelete(ctx, payload, 'TreeInstance', (event, response) => {
          console.log('Delete TreeInstance stuff happened!', event, response)
          response.status === 'success' ? resolve(response) : reject(response)
        })
      })
    }),
  },
  template: {
    saveTreeTemplate: thunk((_, payload, { getStoreState }) => {
      const ctx = getStoreState().user.seats.current
      const project = getStoreState().project.current
      return new Promise((resolve, reject) => {
        if (project) {
          ipcCreate(
            ctx,
            { projectId: project.id, ...payload },
            'Template',
            (event, response) => {
              console.log('Saving Tree Template', event, response)
              response.status === 'success'
                ? resolve(response)
                : reject(response)
            }
          )
        } else {
          reject({
            status: 'error',
            message: 'Could not determine current project',
          })
        }
      })
    }),
  },
}
