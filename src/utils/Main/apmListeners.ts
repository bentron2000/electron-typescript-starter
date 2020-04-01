import { ipcMain, IpcMainEvent } from 'electron'
import { Stage, Repository } from '@models'

export const apmListeners = () => {
  // Background Processing
  type Task = [string, any]
  const available: Electron.WebContents[] = [] // stack of available background processes
  const tasks: Task[] = [] // queue of tasks to be done

  function performTask() {
    console.log(
      `APM Processes: Available => ${available.length}, Tasks => ${tasks.length}`
    )
    while (available.length > 0 && tasks.length > 0) {
      const task = tasks.shift()
      const next = available.shift()
      if (next) {
        if (task && task[0] && task[1]) {
          next.send(task[0], task[1])
        }
      }
    }
  }

  // Add background processes to the available array
  ipcMain.on('ready', (event: IpcMainEvent, _arg: string) => {
    available.push(event.sender)
    performTask()
  })

  ipcMain.on('apm-log', (_event: IpcMainEvent, arg: string) => {
    console.log('APM Log', arg)
  })

  ipcMain.on(
    'ingest',
    (
      event: IpcMainEvent,
      selectedFiles: string[],
      stage: Stage,
      repo: Repository,
      dbWindowId: number
    ) => {
      const addIngestTask = (fileName: string) =>
        tasks.push(['ingest', [fileName, stage, repo, dbWindowId]])
      selectedFiles.map(addIngestTask)
      performTask()
    }
  )
}