/**
 * A WindowProps object is passed to the UI component when mounted and describes the internal properties for that.
 */
import { ISplashWindowProps } from './SplashWindow'
import { IUIWindowProps } from './UIWindow'
import { IUIOWindowProps } from './UIWindowOld' // to delete
import { IDBWindowProps } from './DBWindow'
import { IAPMWindowProps } from './APMWindow'

export {
  ISplashWindowProps,
  IUIWindowProps,
  IDBWindowProps,
  IAPMWindowProps,
  IUIOWindowProps,
}

export type WindowProps =
  | ISplashWindowProps
  | IUIWindowProps
  | IDBWindowProps
  | IAPMWindowProps
  | IUIOWindowProps // to delete
