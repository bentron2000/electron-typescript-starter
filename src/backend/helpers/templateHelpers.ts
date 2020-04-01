import { TDTemplate } from '@backend/schema/TreeDefinitionEntity'

// Some TDTemplate helpers.
export const tdTemplateReduce = <T>(
  tdt: TDTemplate,
  fn: (acc: T, val: TDTemplate) => T,
  acc: T
): T[] => {
  const newAcc = fn(acc, tdt)
  return (tdt.children.length > 0
    ? tdt.children.map(child => tdTemplateReduce(child, fn, newAcc))
    : [newAcc]
  ).flat()
}

export const templateReducer = (
  acc: { [key: string]: string[] },
  val: TDTemplate
) => {
  const t = {}
  t[val.id] = val.instanceIds
  return { ...t, ...acc }
}
