import { Stage } from '@models'
import { ipcRenderer } from 'electron'
import { LoupeRealmResponse, renderError } from './ipc'
import { v4 as uuid } from 'uuid'
import { ipcToDb } from '@redux/state/helpers/ipcDbWindowHelper'

export interface PendingAsset {
  readonly id: string
  readonly model: string
  hash: string
  sourcePath: string
  fileName: string
  metadata: { [key: string]: any }
  stageId: string
  format: { ext: string; mime: string }
  thumbnail: string
  preview: string
}

export function buildPendingAsset(pa: Partial<PendingAsset>): PendingAsset {
  return {
    id: '',
    model: 'PendingAsset',
    hash: '',
    sourcePath: '',
    fileName: '',
    metadata: {},
    stageId: '',
    format: { ext: 'unknown', mime: 'unknown' },
    thumbnail: '',
    preview: '',
    ...pa,
  }
}

export const clearUnmatchedPendingAssets = (stage: Stage) => {
  // requires a stage
  ipcToDb('clear-unmatched-pending-assets', stage)
  // unsubscribe or we'll leak
  ipcToDb('unsubscribe-from-stage-pendingAssets')
}

export const importFiles = (
  stage: Stage | undefined
): Promise<LoupeRealmResponse> => {
  return new Promise((resolve, reject) => {
    if (!stage) {
      console.log('uh oh - no stage supplied')
      reject(renderError('No stage', 'Not operating on a stage'))
      return
    }
    // We're ingesting assets  - are we allowed to add assets?
    // (probably should grey out or not show the button if we aren't...)

    // More UX to consider for repo stuff
    const repo = stage.repositories[0]

    if (!repo) {
      reject(renderError('No Repo', 'No Repository configured'))
      return
    }

    const handleResponse = (_event: Event, response: LoupeRealmResponse) => {
      response.status === 'success' ? resolve(response) : reject(response)
    }

    const responseChannel = uuid()
    ipcRenderer.send('select-files-for-ingestion', stage, repo, responseChannel)
    ipcRenderer.once(responseChannel, handleResponse)
  })
}
