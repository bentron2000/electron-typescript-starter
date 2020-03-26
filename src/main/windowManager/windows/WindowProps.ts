/**
 * A WindowProps object is passed to the UI component when mounted and describes the internal properties for that.
 */
import { ISplashWindowProps } from './SplashWindow'
import { IUIWindowProps } from './UIWindow'

export { ISplashWindowProps, IUIWindowProps }

export type WindowProps = ISplashWindowProps | IUIWindowProps
