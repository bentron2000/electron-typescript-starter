import { IpcRendererEvent } from 'electron'

export interface LoupeRealmResponse<T = any> {
  status: 'success' | 'error'
  data: T
  message?: string
}

export interface LoupeRealmSuccessResponse<T = any>
  extends Required<Omit<LoupeRealmResponse<T>, 'message'>> {}

export interface LoupeRealmErrorResponse<T = any>
  extends Required<LoupeRealmResponse<T>> {}

export type LoupeRealmIPCSendResponse<T = any> = (
  event: Event,
  response: LoupeRealmResponse<T>
) => void

export type LoupeRealmResponseCallback<T = any> = (
  response: LoupeRealmResponse<T>
) => void

export interface ImportResponse {
  importSuccess: string[]
  importFail: string[]
}

export function renderSuccess<T = any>(
  data: T | {} = {}
): LoupeRealmSuccessResponse<T | {}> {
  return { status: 'success', data }
}

export function renderError<T, E = any>(
  err?: E,
  message = 'Unknown Error',
  data: T | {} = {}
): LoupeRealmErrorResponse {
  if (err) {
    console.log('REALM ERROR: ', err)
  }
  return { status: 'error', message, data }
}

export const ipcReply = (
  event: IpcRendererEvent,
  channel: string,
  ...args: any
) => {
  // incomplete types for IpcRendererEvent (https://electronjs.org/docs/api/structures/ipc-renderer-event)
  // @ts-ignore
  event.sender.sendTo(event.senderId, channel, ...args)
}

export const responseToTuple = async <T>(
  promise: Promise<LoupeRealmResponse<T>>
): Promise<[LoupeRealmErrorResponse | null, T | null]> => {
  return promise
    .then(
      (response: LoupeRealmResponse<T>) => [null, response.data] as [null, T]
    )
    .catch((err: LoupeRealmErrorResponse) => [err, null])
}
