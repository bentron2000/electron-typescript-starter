import { Action, action, Thunk, thunk } from 'easy-peasy'
import { merge, clone } from 'ramda'
import { attemptLogin, LoginUserObj } from '@models/User'
import { LoupeModel } from '.'

export interface Perspective {
  readonly id: 'dashboard' | 'brief' | 'tree' | 'workflow' | 'assets'
  data: PerspectiveData
}

interface PerspectiveData {
  name?: string
  rhpTitle: string | undefined
}

interface SearchState {
  query: string
  set: Action<SearchState, string>
  clear: Action<SearchState>
}

type perspectiveIds = 'dashboard' | 'brief' | 'tree' | 'workflow' | 'assets'

export interface AppState {
  isLoggedIn: string | undefined

  currentTeam: string | null
  currentPerspective: Perspective | undefined
  perspectives: Perspective[]

  setCurrentPerspective: Action<AppState, perspectiveIds>
  updatePerspectiveData: Action<
    AppState,
    {
      id: perspectiveIds
      data?: PerspectiveData
    }
  >

  setAllRhpsUnlocked: Thunk<AppState, void, void, LoupeModel>

  isRightPanelOpen: boolean
  toggleRightPanel: Action<AppState, boolean>

  rightPanelTitle: string
  setRightPanelTitle: Action<AppState, string>

  isAdminMode: boolean
  toggleAdminMode: Action<AppState, boolean>

  setIsLoggedIn: Action<AppState, string>
  tryLogin: Thunk<AppState, LoginUserObj, void, LoupeModel>

  search: SearchState
}

const PERSPECTIVES: Perspective[] = [
  { id: 'dashboard', data: { name: 'Dashboard', rhpTitle: 'Dashboard' } },
  { id: 'brief', data: { name: 'Brief', rhpTitle: 'Brief Perspective' } },
  { id: 'tree', data: { name: 'Tree', rhpTitle: 'Tree Perspective' } },
  {
    id: 'workflow',
    data: { name: 'Workflow', rhpTitle: 'Workflow Perspective' },
  },
  { id: 'assets', data: { name: 'Assets', rhpTitle: 'Assets Perspective' } },
]

export const app: AppState = {
  isLoggedIn: undefined, // will replace with auth tokens or whatever. We'll just use the user itself for now

  currentTeam: null,

  currentPerspective: undefined,

  perspectives: clone(PERSPECTIVES),

  setCurrentPerspective: action((state, id) => {
    state.currentPerspective = state.perspectives.find(p => p.id === id)
  }),

  updatePerspectiveData: action((state, { id, data }) => {
    const perspectiveIndex = state.perspectives.findIndex(
      (p: Perspective) => p.id === id
    )
    const perspective = state.perspectives[perspectiveIndex]
    // Merge new data to the selected perspective, or if no data is given, reset to default.
    perspective.data = merge(
      perspective.data,
      data || PERSPECTIVES[perspectiveIndex].data || {}
    )
    state.currentPerspective = perspective
  }),

  setAllRhpsUnlocked: thunk((_a, _p, { getStoreActions }) => {
    const a = getStoreActions()
    a.briefPerspective.rhp.setAllUnlocked()
    a.assetPerspective.rhp.setAllUnlocked()
    a.treePerspective.rhp.setAllUnlocked()
  }),

  isRightPanelOpen: true,
  toggleRightPanel: action((state, payload) => {
    state.isRightPanelOpen = payload
  }),

  rightPanelTitle: '',
  setRightPanelTitle: action((state, payload) => {
    state.rightPanelTitle = payload
  }),

  isAdminMode: true,
  toggleAdminMode: action((state, payload) => {
    state.isAdminMode = payload
  }),

  setIsLoggedIn: action((state, payload) => {
    state.isLoggedIn = payload
  }),
  tryLogin: thunk(async (actions, user, {}) => {
    attemptLogin(user, success => {
      if (success) {
        actions.setIsLoggedIn(user.id)
      } else {
        console.log('Failed login!')
      }
    })
  }),
  search: {
    query: '',
    set: action((state, payload) => {
      state.query = payload.toLowerCase()
    }),
    clear: action(state => {
      state.query = ''
    }),
  },
}
