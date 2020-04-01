import { ipcRenderer, Event } from 'electron'
import { Stage, Repository } from '@models'
import { ingestAssets } from './ingest'

export const apm = () => {
  function ready() {
    ipcRenderer.send('ready')
  }

  ipcRenderer.on(
    'ingest',
    (_event: Event, args: [string, Stage, Repository, number]) => {
      const [fileName, stage, repo, dbWindowId] = args
      ingestAssets(fileName, stage, repo, dbWindowId).then(() => {
        ready()
      })
    }
  )

  ready()
}
