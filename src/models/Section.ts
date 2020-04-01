import { Element, Ctx } from '.'
import { ipcRenderer, Event } from 'electron'
import { ipcToDb } from '@redux/state/helpers/ipcDbWindowHelper'

export interface Section {
  readonly id: string
  readonly model: string
  name: string
  stageIds: string[]
  elements: Element[]
  elementsOrder: string[]
  projectId: string
}

export function buildSection(s: Partial<Section>): Section {
  return {
    id: '',
    model: 'Section',
    name: '',
    stageIds: [],
    elements: [],
    elementsOrder: [],
    projectId: '',
    ...s,
  }
}

// TODO: Get rid of the bespoke ipc comms and replace with ipc helper fn
export function getSectionsByProject(
  ctx: Ctx,
  projectId: string,
  setter: (sections: Section[]) => void
) {
  ipcRenderer.removeAllListeners('update-project-sections') // clear old listeners
  ipcRenderer.on('update-project-sections', (_: Event, sections: Section[]) => {
    setter(sections)
  }) // set new listener
  ipcToDb('unsubscribe-from-project-sections') // tell realm to unsubscribe from any old subscription
  ipcToDb('subscribe-to-project-sections', ctx, projectId) // subscribe to sections for a project
}

export function numStaticElements(section: Section) {
  return section.elements.filter(e => !e.isFieldSet).length
}

export function numFieldsetlements(section: Section) {
  return section.elements.filter(e => e.isFieldSet).length
}

export function isAssignedToStage(section: Section, stageId: string): boolean {
  return section.stageIds.includes(stageId)
}
