import { IWindow } from './Window'
// import { apm } from '@utils/APMProcess/apmWindowListeners'
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
      showDevTools: false,
    }
  },
  getComponent: () =>
    import('@components/WindowRoots/APMProcessWindow').then(
      // TODO: Fix the props for this to include a type
      m => m.APMProcessWindow as any
    ),
  getTrackedProperties: () => ({}),
}
