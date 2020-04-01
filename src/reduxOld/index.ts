import { createStore, createTypedHooks, State } from 'easy-peasy'
import model, { LoupeModel, config } from './state'

const { useStoreActions, useStoreDispatch, useStoreState } = createTypedHooks<
  LoupeModel
>()

const store = createStore(model, config)

export { store, useStoreActions, useStoreDispatch, useStoreState, State }
