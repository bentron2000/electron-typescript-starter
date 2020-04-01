import { MediaItem } from '@models'

export interface TreeInstance {
  readonly id: string
  readonly model: string
  name: string
  parentId: string | undefined
  definitionId: string
  mediaAllowed: boolean
  children: TreeInstance[]
  media: MediaItem[]
  elements: string[]
  elementData: string[]
}

export function buildTreeInstance(ti: Partial<TreeInstance>): TreeInstance {
  return {
    id: '',
    model: 'TreeInstance',
    name: 'Change this...',
    parentId: undefined,
    definitionId: '',
    mediaAllowed: false,
    children: [],
    media: [],
    elements: [],
    elementData: [],
    ...ti,
  }
}

export function tIgetName(ti: TreeInstance): string | undefined {
  return ti.name && ti.name === 'Root' ? 'Entire Project' : ti.name
}

export function tIflatMap<T>(
  treeInst: TreeInstance,
  fn: (ti: TreeInstance) => T,
  excludeSelf?: boolean
): T[] {
  const result =
    treeInst.children.length > 0
      ? [
          ...treeInst.children.flatMap(child =>
            tIflatMap(child, ti => fn(ti), false)
          ),
        ]
      : []
  return excludeSelf ? result : [fn(treeInst), ...result]
}

export function tIfindById(
  treeInst: TreeInstance,
  input: string | string[] | undefined
): TreeInstance[] {
  if (!input) {
    return []
  } else if (input instanceof Array) {
    return input.flatMap(id => tIfindById(treeInst, id))
  } else {
    return tIfilter(treeInst, ti => ti.id === input)
  }
}

export function tIfilter(
  treeInst: TreeInstance,
  fn: (ti: TreeInstance) => boolean
): TreeInstance[] {
  const result = [] as TreeInstance[]
  tIflatMap(treeInst, ti => (fn(ti) ? result.push(ti) : null))
  return result
}

export function tIreduce<T>(
  treeInst: TreeInstance,
  fn: (acc: T, val: TreeInstance) => T,
  acc: T
): T[] {
  const newAcc = fn(acc, treeInst)
  return treeInst.children.length > 0
    ? treeInst.children.flatMap(child => tIreduce(child, fn, newAcc))
    : [newAcc]
}

export function tIgetBranch(
  treeInst: TreeInstance,
  target: TreeInstance,
  acc: TreeInstance[] = []
): TreeInstance[] {
  // The full branch from this item to a target, or [target]
  // NB. This should only really be called on a root TI...
  return target && target.parentId
    ? tIgetBranch(treeInst, tIfindById(treeInst, target.parentId)[0], [
        target,
        ...acc,
      ])
    : [target, ...acc].filter(t => t)
}

export function tIgetBranchByTargetId(
  treeInst: TreeInstance,
  targetId: string | undefined
): TreeInstance[] {
  return targetId
    ? tIgetBranch(treeInst, tIfindById(treeInst, targetId)[0])
    : []
}
