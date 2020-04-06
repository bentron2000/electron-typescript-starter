import React, { Component } from 'react'
import { MemoryRouter as Router } from 'react-router-dom'
import { StoreProvider } from 'easy-peasy'
import { store } from '@redux/store'
import { rendererIPCListeners } from '@utils/UIRenderer/rendererIPCListeners.ts'
import { App } from '@components/App'

rendererIPCListeners()

// export const UIProcessWindow = () => {
//   return (
//     <Router>
//       <StoreProvider store={store}>
//         <App />
//       </StoreProvider>
//     </Router>
//   )
// }

export class UIProcessWindow extends Component {
  public render() {
    return (
      <Router>
        <StoreProvider store={store}>
          <App />
        </StoreProvider>
      </Router>
    )
  }
}
