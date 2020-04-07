import qs from 'querystring'

import { IUIWindowProps, WindowProps } from './WindowProps'

export type WindowType = 'ui-window' | 'db-window' | 'apm-window'

/**
 * A WindowOptions object contains the type of window and the props getting passed to its UI component
 */
interface IWindowOptions {
  type: WindowType
  props: WindowProps
}

export interface IUIWindowOptions extends IWindowOptions {
  type: 'ui-window'
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
  | IUIWindowOptions
  | IDBWindowOptions
  | IAPMWindowOptions

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
}
