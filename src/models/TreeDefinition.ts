import { ipcRenderer, Event } from 'electron'
import { TreeInstance } from '@models/TreeInstance'
import { Ctx } from '@models/Ctx'
import { ipcToDb } from '@redux/state/helpers/ipcDbWindowHelper'

export interface TreeDefinition {
  readonly id: string
  readonly model: string
  name: string
  parentId: string | undefined
  project: string // TODO is this meant to be an ID or the Project itself?
  instances: TreeInstance[]
  children: TreeDefinition[]
  mediaAllowed: boolean
  collaboratorMode: boolean
  allowedFormats: string[]
}

export function buildTreeDefinition(
  td: Partial<TreeDefinition>
): TreeDefinition {
  return {
    id: '',
    model: 'TreeDefinition',
    name: 'New level',
    project: '',
    parentId: undefined,
    mediaAllowed: false,
    collaboratorMode: false,
    allowedFormats: [],
    children: [],
    instances: [],
    ...td,
  }
}

export function getRootTdByProject(
  ctx: Ctx,
  projectId: string,
  setter: (stages: TreeDefinition) => void
) {
  ipcRenderer.removeAllListeners('update-project-tree') // clear old listeners
  ipcRenderer.on('update-project-tree', (_: Event, rootTD: TreeDefinition) => {
    setter(rootTD)
  }) // set new listener
  ipcToDb('unsubscribe-from-project-tree') // tell realm to unsubscribe from any old subscription
  ipcToDb('subscribe-to-project-tree', ctx, projectId) // subscribe to tree for a project
}

export function tDflatMap<T>(
  treeDef: TreeDefinition,
  fn: (td: TreeDefinition) => T,
  excludeSelf?: boolean
): T[] {
  const result =
    treeDef.children.length > 0
      ? [
          ...treeDef.children.flatMap(child =>
            tDflatMap(child, td => fn(td), false)
          ),
        ]
      : []
  return excludeSelf ? result : [fn(treeDef), ...result]
}

export function tDfindById(
  treeDef: TreeDefinition,
  ids: string | string[] | undefined
): TreeDefinition[] {
  if (!ids) {
    return []
  } else if (ids instanceof Array) {
    return ids.flatMap(id => tDfindById(treeDef, id))
  } else {
    return tDfilter(treeDef, td => td.id === ids)
  }
}

export function tDfilter(
  treeDef: TreeDefinition,
  fn: (td: TreeDefinition) => boolean
): TreeDefinition[] {
  const result = [] as TreeDefinition[]
  tDflatMap(treeDef, td => (fn(td) ? result.push(td) : null))
  return result
}

export function tDreduce<T>(
  treeDef: TreeDefinition,
  fn: (acc: T, val: TreeDefinition) => T,
  acc: T
): T[] {
  const newAcc = fn(acc, treeDef)
  return treeDef.children.length > 0
    ? treeDef.children.flatMap(child => tDreduce(child, fn, newAcc))
    : [newAcc]
}

export function tDgetBranch(
  treeDef: TreeDefinition,
  target: TreeDefinition,
  acc: TreeDefinition[] = []
): TreeDefinition[] {
  // The full branch from this item to a target, or [target]
  // NB. This should only really be called on a root TD...
  return target && target.parentId
    ? tDgetBranch(treeDef, tDfindById(treeDef, target.parentId)[0], [
        target,
        ...acc,
      ])
    : [target, ...acc].filter(t => t)
}
