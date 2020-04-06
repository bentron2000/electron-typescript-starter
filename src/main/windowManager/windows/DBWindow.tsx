import { IWindow } from './Window'

// tslint:disable-next-line:no-empty-interface
export interface IDBWindowProps {
  // Tumbleweed
}

export const DBWindow: IWindow = {
  getWindowOptions: props => {
    return {
      title: 'DBWindow',
      width: 900,
      height: 600,
      showDevTools: false,
    }
  },
  getComponent: () =>
    import('@components/WindowRoots/DBProcessWindow').then(
      // TODO: Fix the props for this to include a type
      m => m.DBProcessWindow as any
    ),
  getTrackedProperties: () => ({}),
}
