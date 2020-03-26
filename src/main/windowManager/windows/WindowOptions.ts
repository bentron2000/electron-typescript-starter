import qs from 'querystring'

import { ISplashWindowProps, IUIWindowProps, WindowProps } from './WindowProps'

export type WindowType = 'splash' | 'ui-window'

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

export type WindowOptions = ISplashWindowOptions | IUIWindowOptions

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
