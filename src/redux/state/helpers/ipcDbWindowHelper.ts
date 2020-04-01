import { store } from '@redux/store'
import { ipcRenderer } from 'electron'

export const ipcToDb = (channel: string, ...args: any) => {
  const dbWindow = store.getState().app.dbwindowId
  ipcRenderer.sendTo(dbWindow, channel, ...args)
}
