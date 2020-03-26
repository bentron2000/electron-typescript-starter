// tslint:disable-next-line
require('module-alias/register')

import electron from 'electron'
import React from 'react'
import ReactDOM from 'react-dom'

// This is needed to prevent Realm JS from writing to directories it doesn't have access to
import './utils/process-directories'

const isDevelopment = process.env.NODE_ENV === 'development'

// Don't report Realm JS analytics data
// @see https://github.com/realm/realm-js/blob/master/lib/submit-analytics.js#L28
process.env.REALM_DISABLE_ANALYTICS = 'true'

// import '../styles/index.scss';

import { renderCurrentWindow } from './main/windowManager/windows/WindowComponent'

const appElement = document.getElementById('app')

if (!isDevelopment) {
  const window = renderCurrentWindow()
  ReactDOM.render(window, appElement)
} else {
  // The react-hot-loader is a dev-dependency, why we cannot use a regular import in the top of this file
  // tslint:disable-next-line:no-var-requires no-require-imports
  const { AppContainer } = require('react-hot-loader')

  const currentWindow = renderCurrentWindow()
  ReactDOM.render(<AppContainer>{currentWindow}</AppContainer>, appElement)

  // Hot Module Replacement API
  if (module.hot) {
    module.hot.accept('./main/windowManager/windows/Window', () => {
      // tslint:disable-next-line:no-var-requires no-require-imports
      const nextGetWindow = require('./main/windowManager/windows/Window')
        .getWindow
      const nextWindow = nextGetWindow()
      // Render the updated window
      ReactDOM.render(<AppContainer>{nextWindow}</AppContainer>, appElement)
    })
  }

  // Load devtron - if not in production
  // tslint:disable-next-line:no-var-requires no-require-imports
  require('devtron').install()
  // Add a tool that will notify us when components update
  if (process.env.WHY_DID_YOU_UPDATE) {
    // tslint:disable-next-line:no-console
    console.warn('Loading why-did-you-update')
    // tslint:disable-next-line:no-var-requires no-require-imports
    const { whyDidYouUpdate } = require('why-did-you-update')
    whyDidYouUpdate(React)
  }
}

// Using process.nextTick - as requiring realm blocks rendering
process.nextTick(() => {
  // tslint:disable-next-line:no-var-requires no-require-imports
  const Realm = require('realm')
  // If sync is enabled on Realm - make it less verbose
  if (Realm.Sync) {
    Realm.Sync.setLogLevel(process.env.REALM_LOG_LEVEL || 'error')
    Realm.Sync.setUserAgent(
      `Loupe ${electron.remote.app.getVersion() || 'unknown'}`
    )
  }
})
