import { v4 as uuid } from 'uuid'
import { ipcRenderer } from 'electron'

import { LoupeRealmResponse } from '@models/ipc'

export interface Repository {
  readonly id: string
  readonly model: string
  name: string
  seatId?: string
  teamId?: string
  ownerName: string
  numStages: number
  config: RepoConfig
}

export interface RepoConfig {
  type?: string // local / Loupe / S3 / Dropbox / Network... etc...?
  path?: string // just local paths for the moment - got to make a better way to handle these
}

export function buildRepository(r: Partial<Repository>): Repository {
  return {
    id: '',
    model: 'Repository',
    name: '',
    ownerName: '',
    numStages: 0,
    config: {},
    ...r,
  }
}

export const selectRepositoryLocation = () => {
  return new Promise<LoupeRealmResponse>((resolve, reject) => {
    const responseChannel = uuid()
    ipcRenderer.send('repository-location-select-dialog', responseChannel)
    ipcRenderer.once(
      responseChannel,
      (_event: Event, response: LoupeRealmResponse) => {
        response.status === 'success' ? resolve(response) : reject(response)
      }
    )
  })
}
