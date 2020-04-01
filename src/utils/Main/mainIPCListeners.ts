import { ipcMain, dialog, IpcMainEvent } from 'electron'
import { Stage, Repository } from '@models'
import { fileFormats } from '@models/fileFormats'
import { renderSuccess, renderError } from '@models/ipc'
import * as path from 'path'
import * as fs from 'fs'

export const mainIPCListeners = (dbWindow: Electron.BrowserWindow) => {
  // Asset Import Selection Dialog
  ipcMain.on(
    'select-files-for-ingestion',
    (
      event: IpcMainEvent,
      stage: Stage,
      repo: Repository,
      _responseChannel: string
    ) => {
      const selectedFiles = dialog.showOpenDialog({
        title: 'Select assets for import...',
        buttonLabel: 'Import',
        filters: [
          {
            name: 'Allowed Formats',
            extensions: fileFormats.extensionList(),
          },
          // TODO: Will require some more complicated logic and UX on the matching screens
          // 1. What formats are allowed on any TDs in the project (what gets inserted into extensions above)
          // 2. Matching - which formats can attach to which TIs based on their Definition
          // { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
          // { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile', 'openDirectory', 'multiSelections'],
      })

      if (selectedFiles) {
        // send out to an APM process everything required to perform ingests.
        // When realm gets into its own proc we'll need to adjust this
        ipcMain.emit(
          'ingest',
          selectedFiles, // THIS MAY NEED TO BE UPDATED WITH THE NEW ELECTRON
          stage,
          repo,
          dbWindow.webContents.id
        )
        event.sender.send('adding-pending-assets', stage)
      }
    }
  )

  ipcMain.on(
    'repository-location-select-dialog',
    (event: IpcMainEvent, responseChannel: string) => {
      const selectedFolder = dialog.showOpenDialog({
        title: 'Select location for repository...',
        buttonLabel: 'Select',
        filters: [{ name: 'Allowed Formats', extensions: [] }],
        properties: ['openDirectory'],
      })
      event.sender.send(
        responseChannel,
        selectedFolder
          ? renderSuccess({
              location: selectedFolder[0],
              name: path.basename(selectedFolder[0]),
            })
          : renderError('Could not select folder.')
      )
    }
  )

  ipcMain.on(
    'open-template-file-select-dialog',
    async (event: IpcMainEvent, teamId: string, responseChannel: string) => {
      const selectedFile = await dialog.showOpenDialog({
        title: 'Select template to import...',
        buttonLabel: 'Import',
        filters: [{ name: 'Allowed Formats', extensions: ['loupetemplate'] }],
        properties: ['openFile', 'openDirectory'],
      })

      try {
        if (selectedFile && selectedFile.filePaths.length === 1) {
          // Was just .length...
          fs.readFile(selectedFile[0], 'utf8', (err, data) => {
            if (err) {
              throw err
            } else {
              dbWindow.webContents.send(
                'handle-template-file-load',
                teamId,
                data,
                responseChannel
              )
              // handleData(data)
            }
          })
        }
      } catch (error) {
        event.sender.send(
          responseChannel,
          renderError(error, 'Failed to load template file')
        )
      }
    }
  )
}
