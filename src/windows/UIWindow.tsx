import { IWindow } from './Window'

export const UIWindow: IWindow = {
  getWindowOptions: props => {
    return {
      title: 'UIWindow',
      width: 900,
      height: 600,
    }
  },
  getComponent: () =>
    import('../components/UIProcessWindow').then(
      // TODO: Fix the props for this to include a type
      m => m.UIProcessWindow as any
    ),
  getTrackedProperties: () => ({}),
}
