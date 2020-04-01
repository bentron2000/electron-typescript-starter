//
// Generalised methods for the FE to communicate over IPC
//
import { ipcRenderer } from 'electron'
import { v4 as uuid } from 'uuid'
import { flatten } from 'ramda'

import { LoupeRealmIPCSendResponse } from '@models/ipc'
import { Ctx } from '@models'
import { ipcToDb } from './state/helpers/ipcDbWindowHelper'

export function ipcSubscribe<T>(
  ctx: Ctx,
  id: string,
  setter: (results: T) => void,
  previousId: string | undefined,
  type: string,
  args?: any
) {
  const channel = `${type}.${id}`
  const oldChannel = `${type}.${previousId}`

  ipcRenderer.removeAllListeners('update.' + oldChannel)
  ipcRenderer.on('update.' + channel, (_: Event, results: T) => setter(results)) // set new listener
  ipcToDb(`unsubscribe-one.${oldChannel}`, args) // tell realm to unsubscribe from previous subscription
  ipcToDb('subscribe-one', ctx, type, id)
}

export function ipcGet(
  ctx: Ctx,
  id: string,
  type: string,
  callback: LoupeRealmIPCSendResponse,
  args?: { [key: string]: any }
) {
  const responseChannel = uuid()
  ipcToDb('get', ctx, id, type, responseChannel, args)
  ipcRenderer.once(responseChannel, callback)
}

export function ipcCreate<T>(
  ctx: Ctx,
  payload: T,
  type: string,
  callback: LoupeRealmIPCSendResponse,
  args?: { [key: string]: any }
) {
  const responseChannel = uuid()
  ipcToDb('create', ctx, payload, type, responseChannel, args)
  ipcRenderer.once(responseChannel, callback)
}

export function ipcDelete(
  ctx: Ctx,
  id: string | string[],
  type: string,
  callback: LoupeRealmIPCSendResponse,
  args?: { [key: string]: any }
) {
  const responseChannel = uuid()
  const ids = flatten([id])
  ipcToDb('delete', ctx, ids, type, responseChannel, args)
  ipcRenderer.once(responseChannel, callback)
}

export function ipcUpdate<T>(
  ctx: Ctx,
  payload: T,
  type: string,
  callback: LoupeRealmIPCSendResponse,
  args?: { [key: string]: any }
) {
  const responseChannel = uuid()
  ipcToDb('update', ctx, payload, type, responseChannel, args)
  ipcRenderer.once(responseChannel, callback)
}
