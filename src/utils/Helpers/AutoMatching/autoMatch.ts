import { Stage } from '@models/Stage'
import { TreeDefinition } from '@models/TreeDefinition'
import { TreeInstance, tIreduce } from '@models/TreeInstance'
import { MediaItem } from '@models/MediaItem'
import { MediaState } from '@models/MediaState'
import { PendingAsset } from '@models/PendingAsset'

// import { fileNamepredicates } from './FileNamePredicates'
import { store } from '@redux/store'

// ******************************
// Auto Matching Results
// ******************************

interface IAutoMatch {
  assignment: IAMConnection // The instance or media state that this match is to
  newInstances: TreeInstance[] // possible new instances we could create? there is some grouping and complexity here...
  // components: IAutoMatchComponent[] // all the components used to arrive at the total weight
  totalWeight: number // how confident we are in this match
}

export type IAMConnection = TreeInstance | MediaState

// ******************************
// Right hand side
// ******************************

interface IAutoMatchingContext {
  predicates: IAMPredicateCollection
  mediaItems: MediaItem[]
  instances: TreeInstance // rootTI
  definitions: TreeDefinition // rootTI
}

interface IAutoMatchingConfig {
  predicates: IAMPredicateArray
  otherOptions?: string // tbc
  // Config for the matching includes the predicates and
  // anything else that can be applied to the
}

type IAMPredicateValueTypes =
  | IAMPayloadFileName
  | IAMPayloadFileNameParts
  | IAMPayloadFilePath
  | IAMPayloadMetadataField
  | IAMPayloadMetadataFieldParts

type IAMPredicateAny = IAMPredicate<IAMPredicateValueTypes>

export type IAMPredicateArray = IAMPredicateAny[]

export interface IAMPredicateCollection {
  [id: string]: IAMPredicateAny
}

// A predicate could return multiple matches...
export interface IAMPredicate<T> {
  id: string
  name: string
  description: string
  modifier: number // a constant to multiply the output with to generate the weight
  valueGenerator: IGeneratorFunc<T>
  comparator: IComparatorFunction<T>
}

type IGeneratorFunc<T> = (input: IAMInput) => T

type IComparatorFunction<T> = (
  payload: T,
  context: IAutoMatchingContext
) => IAutoMatch[]

type IAMPredicateLoader = (preds: IAMPredicateArray) => IAMPredicateCollection

export const predicateLoader: IAMPredicateLoader = predArray => {
  const reduce = (acc: IAMPredicateCollection, curr: IAMPredicateAny) => {
    acc[curr.id] = curr
    return acc
  }
  return predArray.reduce(reduce, {})
}

export const createContext = (stageId: string, config: IAutoMatchingConfig) => {
  // This version uses the current redux state to work out the context
  const state = store.getState()
  const instances = state.project.tree.rootTI
  const definitions = state.project.tree.rootTD
  const stage = state.project.stages.all.find(s => s.id === stageId)

  const mediaItems = (stg: Stage, rtTi: TreeInstance) => {
    const miIds = stg.mediaStates.map(ms => ms.mediaItemId)
    const mIReducer = (acc: MediaItem[], val: TreeInstance) => {
      const media = val.media
      const matchingMedia = media.filter(m => miIds.includes(m.id))
      return [...matchingMedia, ...acc]
    }
    return tIreduce(rtTi, mIReducer, []).flat()
  }
  if (instances && definitions) {
    return {
      predicates: predicateLoader(config.predicates),
      mediaItems: stage && instances ? mediaItems(stage, instances) : [],
      instances,
      definitions,
    }
  } else {
    return
  }
}

// ******************************
// Left hand side
// ******************************

export type IAMInput = PendingAsset | MediaState

interface IAutoMatchPayload {
  id: string
  components: IAMPredicateValueTypes[]
}

export const generatePayload = (
  item: IAMInput,
  preds: IAMPredicateCollection
): IAutoMatchPayload => {
  return {
    id: item.id,
    components: Object.keys(preds).map(key => preds[key].valueGenerator(item)),
  }
}

// Payload component
export interface IAMPayloadFileName {
  predicateId: string
  value: string
}

export interface IAMPayloadFileNameParts {
  predicateId: string
  originalString: string
  parts: string[]
}

export interface IAMPayloadMetadataField {
  predicateId: string
  name: string
  value: any
}

export interface IAMPayloadMetadataFieldParts {
  predicateId: string
  name: string
  parts: any[]
}

export interface IAMPayloadFilePath {
  predicateId: string
  path: string
  components: string[]
}

// ******************************
// Comparison Logic
// ******************************

// load in the predicates
// const predicates = { ...fileNamepredicates }

// generate the context
// const context = createContext('projectId', {
//   predicates,
//   otherOptions: 'lalalala',
// })

export const generateCompareFunc = (ctxt: IAutoMatchingContext) => (
  item: IAMInput
): IAutoMatch[] => {
  return generatePayload(item, ctxt.predicates)
    .components.map(c => ctxt.predicates[c.predicateId].comparator(c, ctxt))
    .flat()
}

// const compareFunc = generateCompareFunc(context)
