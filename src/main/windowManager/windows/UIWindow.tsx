import { IWindow } from './Window'

// tslint:disable-next-line:no-empty-interface
export interface IUIWindowProps {
  // Tumbleweed
}

export const UIWindow: IWindow = {
  getWindowOptions: props => {
    return {
      width: 1200,
      height: 900,
      minWidth: 1024,
      minHeight: 768,
      // titleBarStyle: 'hidden',
    }
  },
  getComponent: () =>
    import('../../../components/WindowRoots/UIProcessWindow').then(
      // TODO: Fix the props for this to include a type
      m => m.UIProcessWindow as any
    ),
  getTrackedProperties: () => ({}),
}
