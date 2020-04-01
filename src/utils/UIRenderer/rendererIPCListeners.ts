import { ipcRenderer } from 'electron'
import { Stage } from '@models'
import { store } from '@redux/store'

export const logToMain = (message: string) => {
  ipcRenderer.send('log', message)
}

export const rendererIPCListeners = () => {
  /**
   * Listen for incoming pending assets in matching
   */
  ipcRenderer.on('adding-pending-assets', (_: Event, stage: Stage) => {
    console.log(`Now ingesting assets for ${stage.name}...`)
    // trigger the matching process and watch the pending assets arrive...
    store.dispatch.matching.pending.fetch(stage) // get the incoming assets
    store.dispatch.matching.ui.setRightPanelWasOpen(
      store.getState().app.isRightPanelOpen
    ) // get the current state of the right panel for restore
    store.dispatch.app.toggleRightPanel(false) // close the right panel
    store.dispatch.matching.ui.setIncoming(true) // trigger matching redirect
  })
}
