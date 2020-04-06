import { ipcRenderer } from 'electron'
import { v4 as uuid } from 'uuid'

import { LoupeRealmResponse, renderError } from '@models/ipc'

export interface TemplateInfo {
  team: string
  id: string
  name: string
  stages: number
  transitions: number
  sections: number
  sectionPermissions: number
  elements: number
  fieldDefinitions: number
  treeDefinitions: number
  treeInstances: number
}

export interface SaveTemplatePayload {
  projectId?: string
  name?: string
  includeStages?: boolean
  includeTransitions?: boolean
  includeSections?: boolean
  includeSectionPermissions?: boolean
  includeElements?: boolean
  includeFieldDefinitions?: boolean
  includeTreeDefinitions?: boolean
  includeTreeInstances?: boolean
}

export const importTemplateFile = (
  teamId: string | undefined
): Promise<LoupeRealmResponse> => {
  return new Promise((resolve, reject) => {
    if (!teamId) {
      console.log('uh oh - no team supplied')
      reject(renderError('No team', 'No team supplied'))
      return
    }

    const handleResponse = (_event: Event, response: LoupeRealmResponse) => {
      response.status === 'success' ? resolve(response) : reject(response)
    }

    const responseChannel = uuid()
    ipcRenderer.send(
      'open-template-file-select-dialog',
      teamId,
      responseChannel
    )
    ipcRenderer.once(responseChannel, handleResponse)
  })
}
