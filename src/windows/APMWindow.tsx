import { IWindow } from './Window'

export const APMWindow: IWindow = {
  getWindowOptions: props => {
    return {
      title: 'APMWindow',
      width: 900,
      height: 600,
    }
  },
  getComponent: () =>
    import('../components/APMProcessWindow').then(
      // TODO: Fix the props for this to include a type
      m => m.APMProcessWindow as any
    ),
  getTrackedProperties: () => ({}),
}
