import { TreeDefinition, TreeInstance } from '@models'
import { tIfindById } from '@models/TreeInstance'
import { tIflatMap } from '../../models/TreeInstance'

export interface TDTreeItem {
  node?: TreeDefinition
  name?: React.ReactNode
  id?: string
  subtitle?: React.ReactNode
  expanded?: boolean
  children?: TDTreeItem[]
  parentId?: string
  addButton?: boolean
  canEdit?: boolean
}

export const tdToTreeItem = (
  node: TreeDefinition,
  canAddNodes = false
): TDTreeItem => {
  return {
    node,
    id: node.id,
    name: node.name,
    expanded: true,
    canEdit: canAddNodes,
    children:
      node.children.length > 0
        ? node.children.map(child => tdToTreeItem(child, canAddNodes))
        : canAddNodes
        ? [
            {
              name: `Add level`,
              parentId: node.id,
              addButton: true,
            },
          ]
        : [],
  }
}

export interface TITreeItem {
  node?: TreeInstance
  name?: React.ReactNode
  tdName?: React.ReactNode | undefined
  id?: string
  subtitle?: React.ReactNode
  expanded?: boolean
  selected?: boolean
  canEdit?: boolean
  children?: TITreeItem[]
  addButton?: boolean
  parent?: TreeInstance
}

export const tiToTreeItem = (
  node: TreeInstance,
  expanded?: (node: TreeInstance) => boolean
): TITreeItem => {
  return {
    node,
    name: node.name,
    expanded: expanded
      ? tIflatMap(node, ti => expanded(ti)).some(bool => bool)
      : false,
    id: node.id,
    children:
      node.children.length > 0
        ? node.children.map(child => tiToTreeItem(child, expanded))
        : [],
  }
}

// Builds the TI tree items excluding the first given node (which should be a root TI).
// TODO: replace uses of tiToTreeItem with this? The main difference is the required getTD method.
// Will other trees display td labels & add handles?
export const tiToTreeItemV2 = (
  parentTi: TreeInstance,
  getTD: (treeDefinitionId: string) => TreeDefinition | undefined,
  canAddNodes = false
): TITreeItem[] => {
  const addHandle = (
    { id, name, collaboratorMode }: TreeDefinition,
    parent: TreeInstance
  ) =>
    canAddNodes || collaboratorMode
      ? [
          {
            id,
            parent,
            name: `Add ${name}`,
            addButton: true,
          },
        ]
      : []

  const rootTd = getTD(parentTi.definitionId)
  const baseTd =
    rootTd && rootTd.children.length ? rootTd.children[0] : undefined

  return parentTi.children.length
    ? parentTi.children
        .map((ti, index) => {
          const td = getTD(ti.definitionId)
          return [
            {
              id: ti.id,
              name: ti.name,
              tdName: td ? td.name : undefined,
              expanded: true,
              node: ti,
              canEdit: canAddNodes || (td && td.collaboratorMode),
              children:
                ti.children.length > 0
                  ? tiToTreeItemV2(ti, getTD, canAddNodes)
                  : // Render add handle for nested tree items if child definition exists
                  td && td.children[0]
                  ? [...addHandle(td.children[0], ti)]
                  : [],
            },
            // Render add handle at the end of the nested list
            ...(td && index === parentTi.children.length - 1
              ? [...addHandle(td, parentTi)]
              : []),
          ]
        })
        .flat()
    : baseTd
    ? [...addHandle(baseTd, baseTd.instances[0])]
    : []
}

// Group a collection by ti parent, callback for determing each item TI relation.
export const groupItemsByTiParent = (
  rootTi: TreeInstance,
  collection: Array<{ [key: string]: any }>,
  getTiIdCb: (item: { [key: string]: any }) => string
) => {
  const out = {}
  collection.forEach(item => {
    const parentTiId =
      tIfindById(rootTi, getTiIdCb(item)).length > 0
        ? tIfindById(rootTi, getTiIdCb(item))[0].parentId
        : undefined
    if (parentTiId) {
      out[parentTiId] ? out[parentTiId].push(item) : (out[parentTiId] = [item])
    }
  })
  return out
}

export const tiToFlatTreeItems = (
  td: TreeDefinition,
  parentTd: TreeDefinition | undefined,
  canAddNodes = false
): { [key: string]: TreeInstance[] } => {
  const out = {}
  if (!parentTd) {
    return out
  }

  // Create available parent ti groups for rendering add buttons (disabled if user cannot add views).
  if (canAddNodes) {
    parentTd.instances.forEach(i => (out[i.id] = []))
  }
  // Group instances with parent ti groups
  td.instances.forEach(ti => {
    if (ti.parentId) {
      out[ti.parentId] ? out[ti.parentId].push(ti) : (out[ti.parentId] = [ti])
    }
  })
  return out
}
