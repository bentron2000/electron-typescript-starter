import { ipcRenderer, Event } from 'electron'

import { Ctx } from '@models/Ctx'
import { MediaState } from '@models/MediaState'
import { Repository } from '@models/Repository'
import { StageTransition } from '@models/StageTransition'
import { PendingAsset } from '@models/PendingAsset'

import { RequireAtLeast } from '@helpers/typeScriptHelpers'
import { ipcToDb } from '@redux/state/helpers/ipcDbWindowHelper'

export type UpdateStageWithId = RequireAtLeast<Partial<Stage>, 'id'>

export interface Stage {
  readonly id: string
  readonly model: string
  name: string
  type: string
  projectId: string
  sectionIds: string[]
  mediaStates: MediaState[]
  inputsAllowed: boolean
  inputs: StageTransition[]
  outputsAllowed: boolean
  outputs: StageTransition[]
  diagramConfig?: string
  repositories: Repository[]
}

export function buildStage(s: Partial<Stage>): Stage {
  return {
    id: '',
    model: 'Stage',
    name: '',
    type: '',
    projectId: '',
    sectionIds: [],
    mediaStates: [],
    inputsAllowed: true,
    inputs: [],
    outputsAllowed: true,
    outputs: [],
    repositories: [],
    ...s,
  }
}

export function getStagesByProject(
  ctx: Ctx,
  projectId: string,
  setter: (stages: Stage[]) => void
) {
  ipcRenderer.removeAllListeners('update-project-stages') // clear old listeners
  ipcRenderer.on('update-project-stages', (_: Event, stages: Stage[]) =>
    setter(stages)
  ) // set new listener
  ipcToDb('unsubscribe-from-project-stages') // tell realm to unsubscribe from any old subscription
  ipcToDb('subscribe-to-project-stages', ctx, projectId) // subscribe to stages for a project
}

export function getPendingAssets(
  ctx: Ctx,
  stage: Stage,
  setter: (pendingAssets: PendingAsset[]) => void
) {
  ipcRenderer.removeAllListeners('update-stage-pendingAssets') // clear old listeners
  ipcRenderer.on(
    'update-stage-pendingAssets',
    (_: Event, pendingAssets: PendingAsset[]) => setter(pendingAssets)
  ) // set new listener
  ipcToDb('unsubscribe-from-stage-pendingAssets') // tell realm to unsubscribe from any old subscription
  ipcToDb('subscribe-to-stage-pendingAssets', ctx, stage.id) // subscribe to pending assets for stage
}
