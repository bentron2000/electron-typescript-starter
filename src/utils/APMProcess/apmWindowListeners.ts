import { ipcRenderer, Event } from 'electron'
import { Stage } from '@models/Stage'
import { Repository } from '@models/Repository'
import { ingestAssets } from './ingest'

export const apm = () => {
  function ready() {
    ipcRenderer.send('ready')
  }

  ipcRenderer.on(
    'ingest',
    (_event: Event, args: [string, Stage, Repository, number]) => {
      const [fileName, stage, repo, dbWindowId] = args
      console.log('PERFORMING INGEST', fileName)
      ingestAssets(fileName, stage, repo, dbWindowId).then(() => {
        ready()
      })
    }
  )

  ready()
}
