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
import * as R from 'ramda'

import { Stage, UpdateStageWithId, buildStage } from '@models/Stage'
import { StageTransition } from '@models/StageTransition'
import { Subscription } from '@models/Subscription'
import { SaveTemplatePayload } from '@models/Template'

import {
  LoupeRealmResponse,
  LoupeRealmErrorResponse,
  renderError,
} from '@models/ipc'
import { ipcUpdate, ipcDelete, ipcCreate } from '@redux/ipc'

import { LoupeModel } from '@redux/state'
import { DiagramConfig } from '@components/perspectives/workflow/Diagram'

interface StagePart {
  current: Computed<StagePart, Stage | undefined, LoupeModel>
  currentStageId: string | undefined
  set: Action<StagePart, Stage>
  toggleStageEditing: string | undefined
  setToggleStageEditing: Action<StagePart, string | undefined>
  clear: Action<StagePart>
  create: Thunk<
    StagePart,
    Stage | undefined,
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
  update: Thunk<StagePart, Stage, void, LoupeModel, Promise<LoupeRealmResponse>>
  delete: Thunk<StagePart, Stage, void, LoupeModel, Promise<LoupeRealmResponse>>
  onUpdateOrDelete: ThunkOn<StagePart, void, LoupeModel>
}

interface TransitionPart {
  all: Computed<TransitionPart, StageTransition[], LoupeModel>
  current: StageTransition | undefined
  set: Action<TransitionPart, StageTransition>
  clear: Action<StagePart>
  create: Thunk<
    TransitionPart,
    StageTransition,
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
  update: Thunk<
    TransitionPart,
    StageTransition,
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
  delete: Thunk<
    TransitionPart,
    StageTransition,
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
}

interface DiagramPart {
  updateNodeLocation: Thunk<
    DiagramPart,
    { x: number; y: number; stage: UpdateStageWithId },
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
  diagramConfig: Partial<DiagramConfig>
  saveDiagramConfig: Action<DiagramPart, Partial<DiagramConfig>>
}

interface TemplatePart {
  saveWorkflowTemplate: Thunk<
    TemplatePart,
    SaveTemplatePayload,
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
}

interface RepositoryPart {
  addRepoToStage: Thunk<
    RepositoryPart,
    Subscription,
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
  removeRepoFromStage: Thunk<
    RepositoryPart,
    Subscription,
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
}

export interface WorkflowPerspectiveState {
  stage: StagePart
  transition: TransitionPart
  diagram: DiagramPart
  template: TemplatePart
  repository: RepositoryPart
}

export const workflowPerspective: WorkflowPerspectiveState = {
  stage: {
    current: computed(
      [
        state => state.currentStageId,
        (_, storeState) => storeState.project.stages.all,
      ],
      (selectedStageId, stages) => stages.find(s => s.id === selectedStageId)
    ),
    currentStageId: undefined,
    set: action((state, payload) => {
      state.currentStageId = payload.id
    }),
    toggleStageEditing: undefined,
    setToggleStageEditing: action((state, payload) => {
      state.toggleStageEditing = payload
    }),
    clear: action(state => {
      state.current = undefined
    }),
    create: thunk((actions, stage, { getStoreState }) => {
      return new Promise((resolve, reject) => {
        const storeState = getStoreState()
        const ctx = storeState.user.seats.current
        const project = storeState.project.current
        if (!project || !ctx) {
          const e = {
            status: 'error',
            message: 'You are not authorized to create stages',
          }
          console.error(e)
          return reject(e as LoupeRealmErrorResponse)
        }

        // Might be something strange that happens here without classes...
        // originally this creates a new Stage with this object as input...
        const newStage =
          stage || buildStage({ name: 'New Stage', type: 'Blank Stage' })

        ipcCreate(
          ctx,
          newStage,
          'Stage',
          (event, response) => {
            console.log('Create Stage stuff happened!', event, response)
            if (response.status === 'success') {
              resolve(response)
              actions.setToggleStageEditing(response.data.id)
            } else {
              reject(response)
            }
          },
          { projectId: project.id }
        )
      })
    }),
    update: thunk((_, payload, { getStoreState }) => {
      return new Promise((resolve, reject) => {
        const ctx = getStoreState().user.seats.current
        ipcUpdate(ctx, payload, 'Stage', (event, response) => {
          console.log('Update Stage stuff happened!', event, response)
          response.status === 'success' ? resolve(response) : reject(response)
        })
      })
    }),
    delete: thunk((_, stage, { getStoreState }) => {
      return new Promise((resolve, reject) => {
        const ctx = getStoreState().user.seats.current
        const args = { projectId: stage.projectId }
        ipcDelete(
          ctx,
          stage.id,
          'Stage',
          (event, response) => {
            console.log('Delete Stage stuff happened!', event, response)
            response.status === 'success' ? resolve(response) : reject(response)
          },
          args
        )
      })
    }),
    onUpdateOrDelete: thunkOn(
      actions => [actions.update, actions.delete],
      (actions, target, { getState }) => {
        // Clear editing stage name on update or delete
        if (
          target.payload &&
          getState().toggleStageEditing === target.payload.id
        ) {
          actions.setToggleStageEditing(undefined)
        }
      }
    ),
  },
  transition: {
    all: computed(
      [(_, storeState) => storeState.project.stages.all],
      stages => {
        const allTransitions = [
          ...stages.flatMap(st => st.inputs),
          ...stages.flatMap(st => st.outputs),
        ]
        const byTransitionId = (t: StageTransition) => t.id
        return R.uniqBy(byTransitionId, allTransitions)
      }
    ),
    current: undefined,
    set: action((state, payload) => {
      state.current = payload
    }),
    clear: action(state => {
      state.current = undefined
    }),
    create: thunk((_, transition, { getStoreState }) => {
      return new Promise((resolve, reject) => {
        const project = getStoreState().project.current
        const ctx = getStoreState().user.seats.current

        if (!project || !ctx) {
          const e = {
            status: 'error',
            message: 'You are not authorized to create stage transitions',
          }
          console.error(e)
          return reject(e as LoupeRealmErrorResponse)
        }

        ipcCreate(
          ctx,
          transition,
          'StageTransition',
          (event, response) => {
            console.log('Update Node Location stuff happened!', event, response)
            response.status === 'success' ? resolve(response) : reject(response)
          },
          { projectId: project.id }
        )
      })
    }),
    update: thunk((_, payload, { getStoreState }) => {
      return new Promise((resolve, reject) => {
        const ctx = getStoreState().user.seats.current
        ipcUpdate(ctx, payload, 'StageTransition', (event, response) => {
          console.log('Update transition stuff happened!', event, response)
          response.status === 'success' ? resolve(response) : reject(response)
        })
      })
    }),
    delete: thunk((_, transition, { getStoreState }) => {
      return new Promise((resolve, reject) => {
        const project = getStoreState().project.current
        const ctx = getStoreState().user.seats.current

        if (!project || !ctx) {
          const e = {
            status: 'error',
            message: 'You are not authorized to delete stage transitions',
          }
          console.error(e)
          return reject(e as LoupeRealmErrorResponse)
        }

        ipcDelete(
          ctx,
          transition.id,
          'StageTransition',
          (event, response) => {
            console.log('Update Node Location stuff happened!', event, response)
            response.status === 'success' ? resolve(response) : reject(response)
          },
          { projectId: project.id }
        )
      })
    }),
  },
  diagram: {
    updateNodeLocation: thunk((_, payload, { getStoreState }) => {
      return new Promise((resolve, reject) => {
        const ctx = getStoreState().user.seats.current

        if (!ctx) {
          const e = {
            status: 'error',
            message: 'You are not authorized to update diagrams',
          }
          console.error(e)
          return reject(e as LoupeRealmErrorResponse)
        }

        const updatedStage = {
          ...payload.stage,
          diagramConfig: JSON.stringify({ x: payload.x, y: payload.y }),
        } as Stage
        ipcUpdate(ctx, updatedStage, 'Stage', (event, response) => {
          console.log('Update Node Location stuff happened!', event, response)
          response.status === 'success' ? resolve(response) : reject(response)
        })
      })
    }),
    diagramConfig: {},
    saveDiagramConfig: action((state, payload) => {
      state.diagramConfig = { ...state.diagramConfig, ...payload }
    }),
  },
  template: {
    saveWorkflowTemplate: thunk((_, payload, { getStoreState }) => {
      const ctx = getStoreState().user.seats.current
      const project = getStoreState().project.current
      return new Promise((resolve, reject) => {
        if (project) {
          ipcCreate(
            ctx,
            { projectId: project.id, ...payload },
            'Template',
            (event, response) => {
              console.log('Saving Workflow Template', event, response)
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
  repository: {
    addRepoToStage: thunk((_actions, payload, { getStoreState }) => {
      return new Promise<LoupeRealmResponse>((resolve, reject) => {
        const ctx = getStoreState().user.seats.current
        if (!ctx) {
          reject(renderError('Could not locate seat', 'Could not locate seat'))
        }
        ipcCreate(ctx, payload, 'Subscription', (event, response) => {
          console.log('Create Subscription stuff happened!', event, response)
          response.status === 'success' ? resolve(response) : reject(response)
        })
      })
    }),
    removeRepoFromStage: thunk((_actions, payload, { getStoreState }) => {
      return new Promise<LoupeRealmResponse>((resolve, reject) => {
        const ctx = getStoreState().user.seats.current
        if (!ctx) {
          reject(renderError('Could not locate seat', 'Could not locate seat'))
        }
        ipcDelete(
          ctx,
          [payload.repository.id, payload.stage.id],
          'Subscription',
          (event, response) => {
            console.log('Delete Subscription stuff happened!', event, response)
            response.status === 'success' ? resolve(response) : reject(response)
          }
        )
      })
    }),
  },
}
