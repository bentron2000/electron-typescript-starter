import React from 'react'
import { MemoryRouter as Router } from 'react-router-dom'
import { StoreProvider } from 'easy-peasy'
import { store } from '../../redux'
import { App } from '../App'

export const UIProcessWindow = () => {
  return (
    <Router>
      <StoreProvider store={store}>
        <App />
      </StoreProvider>
    </Router>
  )
}