import { State } from 'easy-peasy'
import { composeWithDevTools, EnhancerOptions } from 'redux-devtools-extension'

import { app, AppState } from './AppState'
import { user, UserState } from './UsersState'
import { project, ProjectState } from './project/ProjectState/ProjectState'
import { matching, MatchingState } from './matching/MatchingState'
import { singleAsset, SingleAssetState } from './single_asset/SingleAssetState'

import {
  briefPerspective,
  BriefPerspectiveState,
  BriefFilter,
} from './BriefPerspectiveState'

import { ElementRelevance } from '@models/ElementRelevance'

import { treePerspective, TreePerspectiveState } from './TreePerspectiveState'

import {
  assetPerspective,
  AssetPerspectiveState,
} from './AssetPerspective/AssetPerspectiveState'

import {
  workflowPerspective,
  WorkflowPerspectiveState,
} from './WorkflowPerspectiveState'

export interface LoupeModel {
  app: AppState
  user: UserState
  project: ProjectState
  briefPerspective: BriefPerspectiveState
  treePerspective: TreePerspectiveState
  assetPerspective: AssetPerspectiveState
  workflowPerspective: WorkflowPerspectiveState
  matching: MatchingState
  singleAsset: SingleAssetState
}

const model: LoupeModel = {
  app,
  user,
  project,
  briefPerspective,
  treePerspective,
  assetPerspective,
  workflowPerspective,
  matching,
  singleAsset,
}

const options = {
  name: 'LOUPE APP DEVTOOLS',
  serialize: {
    replacer: (key: any, value: any) => {
      // Parse redux devtools input so that huge
      // Base64 image strings don't make it splode.
      if (key === 'thumbnail' || key === 'preview') {
        if (typeof value === 'string') {
          return `${value.substring(0, 50)}<<LONG BASE 64 STRING>>`
        } else {
          return value
        }
      } else {
        return value
      }
    },
  },
} as EnhancerOptions

export const config = {
  compose: composeWithDevTools(options),
}

export {
  app,
  AppState,
  user,
  UserState,
  project,
  ProjectState,
  BriefFilter,
  ElementRelevance,
  State,
  briefPerspective,
  BriefPerspectiveState,
  treePerspective,
  TreePerspectiveState,
  assetPerspective,
  AssetPerspectiveState,
  workflowPerspective,
  WorkflowPerspectiveState,
  MatchingState,
  SingleAssetState,
}

export default model
