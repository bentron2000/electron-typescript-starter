import { IWindow } from './Window'

export const DBWindow: IWindow = {
  getWindowOptions: props => {
    return {
      title: 'DBWindow',
      width: 900,
      height: 600,
    }
  },
  getComponent: () =>
    import('../components/DBProcessWindow').then(
      // TODO: Fix the props for this to include a type
      m => m.DBProcessWindow as any
    ),
  getTrackedProperties: () => ({}),
}
