import { app, dialog, Menu } from 'electron'

import { LOUPE_PROTOCOL } from '../constants'
import { WindowManager } from './windowManager/WindowManager'
import { getDefaultMenuTemplate } from './MainMenu'
import { mainIPCListeners } from '@utils/Main/mainIPCListeners'
import { apmListeners } from '@utils/Main/apmListeners'

export class Application {
  public static sharedApplication = new Application()

  private windowManager = new WindowManager()
  // private updater = new Updater(this.windowManager)

  // All files opened while app is loading will be stored on this array and opened when app is ready
  // @ts-ignore
  private delayedRealmOpens: string[] = []

  // All urls opened while app is loading will be stored in this array and opened when app is ready
  // @ts-ignore
  private delayedUrlOpens: string[] = []

  public run() {
    // Check to see if this is the first instance or not
    const hasAnotherInstance = app.requestSingleInstanceLock() === false

    if (hasAnotherInstance) {
      // Quit the app if started multiple times
      app.quit()
    } else {
      // Register as a listener for specific URLs
      this.registerProtocols()

      // In Mac we detect the files opened with `open-file` event otherwise we need get it from `process.argv`
      if (process.platform !== 'darwin') {
        this.processArguments(process.argv)
      }
      // Register all app listeners
      this.addAppListeners()

      // If its already ready - the handler won't be called
      if (app.isReady()) {
        this.onReady()
      }
      // Handle any second instances of the Application
      app.on('second-instance', this.onInstanceStarted)
    }
  }

  public destroy() {
    this.removeAppListeners()
    // this.updater.destroy()
    this.windowManager.closeAllWindows()
  }

  public userDataPath(): string {
    return app.getPath('userData')
  }

  ////////////////////////////////////////////
  // WINDOW DECLARATIONS
  ////////////////////////////////////////////

  // SPLASH WINDOW
  public showSplash(): Promise<void> {
    const { window, existing } = this.windowManager.createWindow({
      type: 'splash',
      props: {},
    })

    if (existing) {
      window.focus()
      return Promise.resolve()
    } else {
      return new Promise(resolve => {
        window.once('ready-to-show', () => {
          window.show()
          resolve()
        })
      })
    }
  }

  // UI WINDOW OLD - TO DELETE
  public showOldUIWindow(): Promise<void> {
    const { window, existing } = this.windowManager.createWindow({
      type: 'uio-window',
      props: {},
    })

    if (existing) {
      window.focus()
      return Promise.resolve()
    } else {
      return new Promise(resolve => {
        // Save this for later
        // Show the window, the first time its ready-to-show
        window.once('ready-to-show', () => {
          window.show()
          resolve()
        })
      })
    }
  }

  // UI WINDOW
  public showUIWindow(): Promise<void> {
    const { window, existing } = this.windowManager.createWindow({
      type: 'ui-window',
      props: {},
    })

    if (existing) {
      window.focus()
      return Promise.resolve()
    } else {
      return new Promise(resolve => {
        // Save this for later
        // Show the window, the first time its ready-to-show
        window.once('ready-to-show', () => {
          window.show()
          resolve()
        })
      })
    }
  }

  // DB WINDOW
  public showDBWindow(): Promise<void> {
    const { window, existing } = this.windowManager.createWindow({
      type: 'db-window',
      props: {},
    })

    if (existing) {
      window.focus()
      return Promise.resolve()
    } else {
      return new Promise(resolve => {
        // Save this for later
        // Show the window, the first time its ready-to-show
        window.once('ready-to-show', () => {
          // window.show() // uncomment to show the DB window
          resolve()
        })
      })
    }
  }

  // APM WINDOW
  public showAPMWindow(): Promise<void> {
    const { window, existing } = this.windowManager.createWindow({
      type: 'apm-window',
      props: {},
    })

    if (existing) {
      window.focus()
      return Promise.resolve()
    } else {
      return new Promise(resolve => {
        // Save this for later
        // Show the window, the first time its ready-to-show
        window.once('ready-to-show', () => {
          // window.show() // uncomment to show the DB window
          resolve()
        })
      })
    }
  }

  ////////////////////////////////////////////
  // PRIVATE
  ////////////////////////////////////////////

  private addAppListeners() {
    app.addListener('ready', this.onReady)
    app.addListener('activate', this.onActivate)
    app.addListener('window-all-closed', this.onWindowAllClosed)
  }

  private removeAppListeners() {
    app.removeListener('ready', this.onReady)
    app.removeListener('activate', this.onActivate)
    app.removeListener('window-all-closed', this.onWindowAllClosed)
  }

  private onReady = async () => {
    this.setDefaultMenu()
    if (this.windowManager.windows.length === 0) {
      // Wait for the greeting window to show - if no other windows are open
      await this.showSplash()
      mainIPCListeners()
      apmListeners()
      // await this.showOldUIWindow()
      this.showDBWindow()
      this.showUIWindow()
      this.showAPMWindow()
    }
    this.performDelayedTasks()
  }

  private onActivate = () => {
    if (this.windowManager.windows.length === 0) {
      // this.showSplash()
    }
  }

  private onWindowAllClosed = () => {
    if (process.platform !== 'darwin') {
      app.quit()
    } else {
      this.setDefaultMenu()
    }
  }

  private registerProtocols() {
    console.log('Registering Protocols')
    this.registerProtocol(LOUPE_PROTOCOL)
  }

  /**
   * If not already - register this as the default protocol client for a protocol
   */
  private registerProtocol(protocol: string) {
    if (!app.isDefaultProtocolClient(protocol)) {
      const success = app.setAsDefaultProtocolClient(protocol)
      if (!success) {
        dialog.showErrorBox(
          'Failed when registering loupe protocol',
          `Loupe could not register the ${protocol}:// protocol.`
        )
      }
    }
  }

  /**
   * This is called when another instance of the app is started on Windows or Linux
   */

  // WE CAN PROBABLY HANDLE THIS MORE SIMPLY UNTIL SUCH TIME THAT WE NEED TO POTENTIALLY RUN
  // MULTIPLE INSTANCES OF THE APP - SAY DIFFERENT PROJECTS IN TWO WINDOWS

  private onInstanceStarted = async (
    event: Event,
    argv: string[],
    workingDirectory: string
  ) => {
    this.processArguments(argv)
    await this.showSplash()
    this.performDelayedTasks()
  }

  private setDefaultMenu = () => {
    const menuTemplate = getDefaultMenuTemplate(this.setDefaultMenu)
    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
  }

  private processArguments(argv: string[]) {
    // this.delayedRealmOpens = argv.filter(arg => arg.endsWith('.realm'))
    this.delayedUrlOpens = argv.filter(arg =>
      arg.startsWith(`${LOUPE_PROTOCOL}://`)
    )
  }

  private async performDelayedTasks() {
    console.log('Perform delayed tasks')
  }
}

if (module.hot) {
  module.hot.dispose(() => {
    Application.sharedApplication.destroy()
  })
}
