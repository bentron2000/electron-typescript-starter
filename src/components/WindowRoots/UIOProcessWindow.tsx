import React from 'react'
import { MemoryRouter as Router } from 'react-router-dom'
import { StoreProvider } from 'easy-peasy'
import { store } from '../../reduxOld'
import { OldApp } from '@components/OldApp'

export const UIOProcessWindow = () => {
  return (
    <Router>
      <StoreProvider store={store}>
        <OldApp />
      </StoreProvider>
    </Router>
  )
}
