import { ipcRenderer, remote } from 'electron'

// const getDBWindowID = () => {
//   const dbWindowId = remote.webContents
//     .getAllWebContents()
//     .filter(x => x.getType() === 'window')
//     // @ts-ignore
//     .filter(x => x.browserWindowOptions.title === 'DBWindow')[0].id
//   console.log('DBWindow ID is ' + dbWindowId)
//   return dbWindowId
// }

export const ipcToDb = (channel: string, ...args: any) => {
  const dbWindowId = remote.getGlobal('windowlist')['db-window']
  ipcRenderer.sendTo(dbWindowId, channel, ...args)
}
