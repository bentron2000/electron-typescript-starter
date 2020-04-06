import { IpcRendererEvent, ipcRenderer } from 'electron'

import { Ctx } from '@models/Ctx'
import { LoupeRealmResponse, ipcReply } from '@models/ipc'

import { StageEntity } from '@backend/schema/StageEntity'
import { UserEntity } from '@backend/schema/UserEntity'
import { ProjectEntity } from '@backend/schema/ProjectEntity'
import { SectionEntity } from '@backend/schema/SectionEntity'
import { ElementEntity } from '@backend/schema/ElementEntity'
import { TreeDefinitionEntity } from '@backend/schema/TreeDefinitionEntity'
import { PendingAssetEntity } from '@backend/schema/PendingAssetEntity'
import { TemplateEntity } from '@backend/schema/TemplateEntity'
import {
  autoLoadTemplates,
  autoLoadNewProjects,
} from '@backend/mockdata/autoLoad'
import {
  newModelInstanceFromResults,
  fetchByTypeNameId,
} from '@backend/helpers/realmHelpers'

import * as loupeEntities from '@backend'

export const registerGenericListeners = (realm: Realm) => {
  const subscribeCallBack = async (
    event: IpcRendererEvent,
    _ctx: Ctx,
    entityType: string,
    id: string
  ) => {
    // TODO: CTX authorization checks to ensure that this user can access this data

    const realmObj = await fetchByTypeNameId(realm, entityType, id)

    const channel = `${entityType}.${id}`
    const setter = (data: any) => {
      ipcReply(event, 'update.' + channel, data)
    }
    const unsubscribe = realmObj
      ? () => realmObj.removeAllListeners()
      : () => undefined

    if (realmObj) {
      realmObj.addListener(object => {
        setter(newModelInstanceFromResults(object))
      })
    }
    // Set up one time listener to be called before any new subscription on this channel
    ipcRenderer.once('unsubscribe-one.' + channel, () => {
      console.log('Unsubscribing ' + channel)
      unsubscribe()
    })
  }

  ipcRenderer.on('subscribe-one', subscribeCallBack)

  // generic get action Listener
  const getCallBack = async (
    event: IpcRendererEvent,
    ctx: Ctx,
    id: string,
    type: string,
    responseChannel: string,
    args?: { [key: string]: any }
  ) => {
    const sendResponse = (response: LoupeRealmResponse) =>
      ipcReply(event, responseChannel, response)
    loupeEntities[`${type}Entity`].get(realm, ctx, id, sendResponse, args)
  }
  ipcRenderer.on('get', getCallBack)

  // generic update action Listener
  const updateCallBack = async (
    event: IpcRendererEvent,
    ctx: Ctx,
    payload: any,
    type: string,
    responseChannel: string,
    args?: { [key: string]: any }
  ) => {
    const sendResponse = (response: LoupeRealmResponse) =>
      ipcReply(event, responseChannel, response)
    loupeEntities[`${type}Entity`].update(
      realm,
      ctx,
      payload,
      sendResponse,
      args
    )
  }
  ipcRenderer.on('update', updateCallBack)

  // generic create action Listener
  const createCallBack = async (
    event: IpcRendererEvent,
    ctx: Ctx,
    payload: any,
    type: string,
    responseChannel: string,
    args?: { [key: string]: any }
  ) => {
    const sendResponse = (response: LoupeRealmResponse) =>
      ipcReply(event, responseChannel, response)
    loupeEntities[`${type}Entity`].create(
      realm,
      ctx,
      payload,
      sendResponse,
      args
    )
  }
  ipcRenderer.on('create', createCallBack)

  // generic delete action Listener
  const deleteCallBack = async (
    event: IpcRendererEvent,
    ctx: Ctx,
    id: string,
    type: string,
    responseChannel: string,
    args?: { [key: string]: any }
  ) => {
    const sendResponse = (response: LoupeRealmResponse) =>
      ipcReply(event, responseChannel, response)
    loupeEntities[`${type}Entity`].delete(realm, ctx, id, sendResponse, args)
  }
  ipcRenderer.on('delete', deleteCallBack)
}

/**
 * Event handlers for asynchronous incoming messages
 */
export const dbIPCListeners = (uiWindowId: number) => {
  // Only setup the user listeners (login-related)
  UserEntity.registerListeners((realm: Realm, mockDataWasInserted: boolean) => {
    // When logged in, we now have access to the realm instance
    registerGenericListeners(realm) // generic C_UD Listeners
    ProjectEntity.registerListeners(realm)
    SectionEntity.registerListeners(realm)
    ElementEntity.registerListeners(realm)
    StageEntity.registerListeners(realm)
    PendingAssetEntity.registerListeners(realm)
    TreeDefinitionEntity.registerListeners(realm)
    ElementEntity.registerListeners(realm)
    TemplateEntity.registerListeners(realm, uiWindowId)

    // Load any templates and new projects
    if (mockDataWasInserted) {
      autoLoadTemplates()
      autoLoadNewProjects(realm)
    }
  })
}

export const dbProcess = () => {
  // Register all the realm listeners here...
  ipcRenderer.on('UI_ready', (event: IpcRendererEvent) => {
    // incomplete types for IpcRendererEvent (https://electronjs.org/docs/api/structures/ipc-renderer-event)
    // @ts-ignore
    const uiWindowId = event.senderId
    dbIPCListeners(uiWindowId)
  })

  const dbReady = () => {
    // Tell main that the realm process is ready so that it can pass
    // the windowId to the UI Renderer process
    ipcRenderer.send('DB-ready')
  }

  dbReady()
}
