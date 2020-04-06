import { ipcRenderer, Event } from 'electron'
import { Stage } from '@models/Stage'
import { Repository } from '@models/Repository'
import { ingestAssets } from './ingest'

export const apm = () => {
  console.log('APM WINDOW LISTENERS REGISTERING')
  function ready() {
    ipcRenderer.send('ready')
  }

  function test() {
    ipcRenderer.send('apm-log', 'APM LOGGER TEST')
  }

  function mainlogtest() {
    ipcRenderer.send('main-log', 'MAIN LOGGER TEST')
  }

  ipcRenderer.on(
    'ingest',
    (_event: Event, args: [string, Stage, Repository, number]) => {
      const [fileName, stage, repo, dbWindowId] = args
      console.log('PERFORMING INGEST', fileName)
      ingestAssets(fileName, stage, repo, dbWindowId).then(() => {
        ready()
        test()
        mainlogtest()
      })
    }
  )

  ready()
  test()
  mainlogtest()
}
