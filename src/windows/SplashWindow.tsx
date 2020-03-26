import { IWindow } from './Window'

// tslint:disable-next-line:no-empty-interface
export interface ISplashWindowProps {
  // Tumbleweed
}

export const SplashWindow: IWindow = {
  getWindowOptions: () => ({
    title: `Loupe`,
    width: 500,
    height: 300,
    frame: false,
  }),
  getComponent: () =>
    import('../components/SplashWindow').then(
      // TODO: Fix the props for this to include a type
      m => m.Splash as any
    ),
  getTrackedProperties: () => ({}),
}
