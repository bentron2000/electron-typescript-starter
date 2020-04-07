// WindowProps object is passed to the UI component when mounted and describes the internal properties for that.
import { IUIWindowProps } from './UIWindow'
import { IDBWindowProps } from './DBWindow'
import { IAPMWindowProps } from './APMWindow'

export { IUIWindowProps, IDBWindowProps, IAPMWindowProps }

export type WindowProps = IUIWindowProps | IDBWindowProps | IAPMWindowProps
