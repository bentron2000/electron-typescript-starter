import { IWindow } from './Window'

// tslint:disable-next-line:no-empty-interface
export interface IUIWindowProps {
  // Tumbleweed
}

export const UIWindow: IWindow = {
  getWindowOptions: props => {
    return {
      width: 1200,
      minWidth: 1024,
      height: 900,
      minHeight: 768,
      titleBarStyle: 'hidden',
      showDevTools: true,
    }
  },
  getComponent: () =>
    import('@components/WindowRoots/UIProcessWindow').then(
      // TODO: Fix the props for this to include a type
      m => m.UIProcessWindow as any
    ),
  getTrackedProperties: () => ({}),
}
