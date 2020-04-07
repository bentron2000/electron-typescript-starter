import { IWindow } from './Window'

// tslint:disable-next-line:no-empty-interface
export interface IAPMWindowProps {
  // Tumbleweed
}

export const APMWindow: IWindow = {
  getWindowOptions: props => {
    return {
      title: 'APMWindow',
      width: 900,
      height: 600,
      showDevTools: true,
    }
  },
  getComponent: () =>
    import('@components/WindowRoots/APMProcessWindow').then(
      // TODO: Fix the props for this to include a type
      m => m.APMProcessWindow as any
    ),
  getTrackedProperties: () => ({}),
}
