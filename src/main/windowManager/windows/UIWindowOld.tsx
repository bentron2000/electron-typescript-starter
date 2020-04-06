import { IWindow } from './Window'

// tslint:disable-next-line:no-empty-interface
export interface IUIOWindowProps {
  // Tumbleweed
}

export const UIWindowOld: IWindow = {
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
    import('@components/WindowRoots/UIOProcessWindow').then(
      // TODO: Fix the props for this to include a type
      m => m.UIOProcessWindow as any
    ),
  getTrackedProperties: () => ({}),
}
