import {
  Action,
  action,
  Thunk,
  thunk,
  Computed,
  computed,
  thunkOn,
  ThunkOn,
} from 'easy-peasy'

import {
  User,
  Seat,
  Team,
  Project,
  ProjectPermission,
  Repository,
} from '@models'
import { userProjects } from '@models/User'
import { ipcSubscribe, ipcCreate, ipcGet } from '@redux/ipc'
import { selectRepositoryLocation } from '@models/Repository'
import { LoupeModel } from './'
import { LoupeRealmResponse } from '@models/ipc'

const DEFAULT_REPOSITORY_LOCATION = '~/Documents/Loupe'

interface UserPart {
  current: User | undefined
  set: Action<UserPart, User>
  subscribe: Thunk<UserPart, string, void, LoupeModel>
  refetchUser: Thunk<UserPart, void, void>
}

interface SeatPart {
  current: Seat | null
  all: Computed<SeatPart, Seat[], LoupeModel>
  getByTeamId: Computed<
    SeatPart,
    (teamId: string) => Seat | undefined,
    LoupeModel
  >
  set: Action<SeatPart, Seat>
  refetchSeat: Thunk<SeatPart, void, void, LoupeModel>
  currentPermissions: Computed<
    SeatPart,
    ProjectPermission | undefined,
    LoupeModel
  >
}

interface RepositoryPart {
  repositories: Computed<RepositoryPart, Repository[], LoupeModel>
  newRepositoryLocation: string
  setRepositoryLocation: Action<RepositoryPart, string | undefined>
  selectRepositoryLocation: Thunk<
    RepositoryPart,
    void,
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
  createRepository: Thunk<
    RepositoryPart,
    Partial<Repository>,
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
}

interface ProjectPart {
  all: Project[]
  set: Action<ProjectPart, Project[]>
  clear: Action<ProjectPart>
}

interface TeamPart {
  current: Team | undefined
  all: Computed<TeamPart, Team[], LoupeModel>
  set: Action<TeamPart, Team>
  subscribe: Thunk<TeamPart, Team, void, LoupeModel>
}

export interface UserState {
  user: UserPart
  seats: SeatPart
  teams: TeamPart
  projects: ProjectPart
  repositories: RepositoryPart
  onLogin: ThunkOn<UserState, void, LoupeModel>
  onUserSet: ThunkOn<UserState, void, LoupeModel>
  onTeamSet: ThunkOn<UserState, void, LoupeModel>
  onSeatSet: ThunkOn<UserState, void, LoupeModel>
}

export const user: UserState = {
  user: {
    current: undefined,
    set: action((state, payload) => {
      state.current = payload
    }),
    subscribe: thunk(async (actions, payload, { getState, getStoreState }) => {
      const ctx = getStoreState().user.seats.current
      const state = getState()
      const previousId = state.current ? state.current.id : undefined

      ipcSubscribe(
        ctx,
        payload,
        (usr: User) => {
          actions.set(usr)
        },
        previousId,
        'User'
      )
    }),
    refetchUser: thunk((actions, _, { getState }) => {
      const usr = getState().current
      if (usr) {
        actions.subscribe(usr.id)
      }
    }),
  },

  seats: {
    current: null,
    all: computed([(_, globalState) => globalState.user.user.current], usr =>
      usr ? usr.seats : []
    ),
    getByTeamId: computed([state => state.all], seats => teamId =>
      seats.find(s => s.team.id === teamId)
    ),
    set: action((state, payload) => {
      state.current = payload
    }),
    refetchSeat: thunk((act, _payload, { getState }) => {
      const seat = getState().current
      if (seat) {
        ipcGet(seat, seat.id, seat.model, (_event, response) => {
          response.status === 'success'
            ? act.set(response.data)
            : console.error('Could not refetch seat!', response.message)
        })
      }
    }),
    currentPermissions: computed(
      [state => state.current, (_, globalState) => globalState.project.current],
      (seat, project) =>
        seat && project
          ? seat.projectPermissions.find(pp => pp.project.id === project.id)
          : undefined
    ),
  },

  teams: {
    current: undefined,
    all: computed([(_, globalState) => globalState.user.user.current], usr =>
      usr ? usr.seats.map(s => s.team) : []
    ),
    set: action((state, payload) => {
      state.current = payload
    }),
    subscribe: thunk(async (actions, payload, { getState, getStoreState }) => {
      const ctx = getStoreState().user.seats.current
      const state = getState()
      const previousId = state.current ? state.current.id : undefined

      ipcSubscribe(
        ctx,
        payload.id,
        (team: Team) => {
          actions.set(team)
        },
        previousId,
        'Team'
      )
    }),
  },

  projects: {
    all: [],
    set: action((state, payload) => {
      state.all = payload
    }),
    clear: action(state => {
      state.all = []
    }),
  },

  repositories: {
    repositories: computed(
      // later include team repos...
      [(_, globalState) => globalState.user.seats.current],
      seat => (seat ? seat.repositories : [])
    ),
    newRepositoryLocation: DEFAULT_REPOSITORY_LOCATION,
    setRepositoryLocation: action((state, payload) => {
      state.newRepositoryLocation = payload || DEFAULT_REPOSITORY_LOCATION
    }),
    selectRepositoryLocation: thunk((actions, _payload) => {
      return new Promise<LoupeRealmResponse>((resolve, reject) => {
        selectRepositoryLocation()
          .then(result => {
            if (result) {
              actions.setRepositoryLocation(result.data.location)
              resolve(result)
            }
          })
          .catch(err => reject(err))
      })
    }),
    createRepository: thunk(
      (_actions, payload, { getState, getStoreState, getStoreActions }) => {
        return new Promise((resolve, reject) => {
          const ctx = getStoreState().user.seats.current
          // to make a repo we need a location, default to making
          // repository for current seat unless team given.
          // currently only able to make local repos
          const repo = {
            ...payload,
            config: {
              type: 'local',
              path: getState().newRepositoryLocation,
            },
          }
          ipcCreate(ctx, repo, 'Repository', (_event, response) => {
            response.status === 'success' ? resolve(response) : reject(response)
          })
          // refetch the user to ensure correct repos in state
          getStoreActions().user.seats.refetchSeat()
        })
      }
    ),
  },

  onLogin: thunkOn(
    (_, storeActions) => storeActions.app.setIsLoggedIn,
    (actions, target) => actions.user.subscribe(target.payload)
  ),

  onUserSet: thunkOn(
    actions => actions.user.set,
    (actions, target) => {
      const seat = target.payload.seats[0]
      if (seat) {
        actions.seats.set(seat)
        actions.teams.subscribe(seat.team)
      }
    }
  ),

  onTeamSet: thunkOn(
    actions => actions.teams.set,
    (actions, target, { getStoreState }) => {
      const seat = getStoreState().user.seats.getByTeamId(target.payload.id)
      if (seat) {
        actions.seats.set(seat)
      }
    }
  ),

  onSeatSet: thunkOn(
    actions => actions.seats.set,
    (actions, target) => {
      const ctx = target.payload // ready for more advanced ctx gen
      userProjects(ctx, payload => actions.projects.set(payload))
    }
  ),
}
