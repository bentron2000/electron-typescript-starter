import { Project } from '@models/Project'
import { Seat } from '@models/Seat'

import { Ctx } from '@models/Ctx'

import { ipcRenderer, Event } from 'electron'
import { ipcToDb } from '@redux/state/helpers/ipcDbWindowHelper'

export interface LoginUserObj {
  id: string
  name: string
  pass: string
  sync: boolean
  mockdata?: string
}

export interface User {
  readonly id: string
  readonly model: string
  name: string
  // lastTeam?: string
  seats: Seat[]
}

export function userProjects(ctx: Ctx, setter: (projects: Project[]) => void) {
  ipcRenderer.removeAllListeners('update-seat-projects') // clear old listeners
  ipcRenderer.on('update-seat-projects', (_: Event, projects: Project[]) =>
    setter(projects)
  ) // set new listener
  ipcToDb('unsubscribe-from-seat-projects') // tell realm to unsubscribe from any old subscription
  ipcToDb('subscribe-to-seat-projects', ctx) // subscribe to projects for a seat
}

export function attemptLogin(
  user: LoginUserObj,
  setter: (success: boolean) => void
) {
  console.log('LOGIN - MODEL', user)
  ipcRenderer.removeAllListeners('receive-login') // clear old listeners
  ipcRenderer.on('receive-login', (_: Event, success: boolean) =>
    setter(success)
  )
  console.log('SENDING LOGIN')
  ipcToDb('try-login', user)
}
