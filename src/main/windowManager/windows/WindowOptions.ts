import qs from 'querystring'

import { ISplashWindowProps, IUIWindowProps, WindowProps } from './WindowProps'

export type WindowType =
  | 'splash'
  | 'ui-window'
  | 'db-window'
  | 'apm-window'
  | 'uio-window' // to delete

/**
 * A WindowOptions object contains the type of window and the props getting passed to its UI component
 */
interface IWindowOptions {
  type: WindowType
  props: WindowProps
}

export interface ISplashWindowOptions extends IWindowOptions {
  type: 'splash'
  props: ISplashWindowProps
}

export interface IUIWindowOptions extends IWindowOptions {
  type: 'ui-window'
  props: IUIWindowProps
}

// old window delete once working
export interface IUIOWindowOptions extends IWindowOptions {
  type: 'uio-window'
  props: IUIWindowProps
}

export interface IDBWindowOptions extends IWindowOptions {
  type: 'db-window'
  props: IUIWindowProps
}

export interface IAPMWindowOptions extends IWindowOptions {
  type: 'apm-window'
  props: IUIWindowProps
}

export type WindowOptions =
  | ISplashWindowOptions
  | IUIWindowOptions
  | IDBWindowOptions
  | IAPMWindowOptions
  | IUIOWindowOptions // to delete

export function getWindowOptions(): WindowOptions {
  // Strip away the "?" of the location.search
  const queryString = location.search.substr(1)
  const query = qs.parse(queryString)
  if (query && typeof query.options === 'string') {
    return JSON.parse(query.options)
  } else {
    throw new Error('Expected "options" in the query parameters')
  }
}

export const WindowEntryHtml = {
  splash: {
    // tslint:disable-next-line:no-var-requires no-require-imports
    development: require('@static/index.development.html'),
    // tslint:disable-next-line:no-var-requires no-require-imports
    production: require('@static/index.html'),
  },
  'ui-window': {
    // tslint:disable-next-line:no-var-requires no-require-imports
    development: require('@static/ui.development.html'),
    // tslint:disable-next-line:no-var-requires no-require-imports
    production: require('@static/ui.html'),
  },
  'db-window': {
    // tslint:disable-next-line:no-var-requires no-require-imports
    development: require('@static/index.development.html'),
    // tslint:disable-next-line:no-var-requires no-require-imports
    production: require('@static/index.html'),
  },
  'apm-window': {
    // tslint:disable-next-line:no-var-requires no-require-imports
    development: require('@static/index.development.html'),
    // tslint:disable-next-line:no-var-requires no-require-imports
    production: require('@static/index.html'),
  },
  'uio-window': {
    // tslint:disable-next-line:no-var-requires no-require-imports
    development: require('@static/index.development.html'),
    // tslint:disable-next-line:no-var-requires no-require-imports
    production: require('@static/index.html'),
  },
}
