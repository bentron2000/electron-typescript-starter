import { Action, action, Thunk, thunk, Computed, computed } from 'easy-peasy'
import { intersection, groupBy, prop, sort, findIndex, propEq } from 'ramda'

import {
  Section,
  Element,
  FieldDefinition,
  FieldValue,
  ElementData,
  ElementRelevance,
  SaveTemplatePayload,
  TreeInstance,
} from '@models'
import {
  updateElementRelevance,
  nestedRelators,
  hasTiRelevance,
} from '@models/Element'
import { ipcUpdate, ipcDelete, ipcCreate } from '@redux/ipc'
import { IRhpState, filterRhpPayload } from '@redux/state/helpers/rhpState'
import { LoupeModel } from '.'
import { briefFilter, TITreeItem } from '@components/helpers'

import { LoupeRealmResponse, LoupeRealmErrorResponse } from '@models/ipc'

import { RequireAtLeast } from '@helpers/typeScriptHelpers'
import { tiToTreeItem } from '@components/helpers/treeHelpers'

export interface BriefFilter {
  stageFilter: string[]
  sectionFilter: string[]
  treeFilter: string[]
}

interface FilterPart {
  current: BriefFilter
  set: Action<FilterPart, BriefFilter>
}

interface SectionPart {
  current: Section | undefined
  set: Action<SectionPart, Section>
  create: Thunk<
    SectionPart,
    { section: Section; positionIndex?: number },
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
  clear: Action<SectionPart>
  update: Thunk<
    SectionPart,
    Section,
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
  delete: Thunk<
    SectionPart,
    string,
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
  getIndex: Computed<SectionPart, (sectionId: string) => number, LoupeModel>
}

interface ElementPart {
  current: Element | undefined
  set: Action<ElementPart, Element>
  create: Thunk<
    ElementPart,
    { element: Element; positionIndex?: number },
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
  clear: Action<ElementPart>
  delete: Thunk<
    ElementPart,
    string,
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
  update: Thunk<
    ElementPart,
    Element,
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
  updateElementData: Thunk<
    ElementPart,
    ElementData,
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
  updateRelevance: Thunk<
    ElementPart,
    ElementRelevance,
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
}

interface FieldPart {
  createDefinition: Thunk<
    FieldPart,
    RequireAtLeast<Partial<FieldDefinition>, 'elementId'>,
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
  deleteDefinition: Thunk<
    FieldPart,
    string,
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
  updateDefinition: Thunk<
    FieldPart,
    Partial<FieldDefinition>,
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
  updateValue: Thunk<
    FieldPart,
    RequireAtLeast<Partial<FieldValue>, 'id'>,
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
}

interface BriefTemplatePart {
  saveBriefTemplate: Thunk<
    BriefTemplatePart,
    SaveTemplatePayload,
    void,
    LoupeModel,
    Promise<LoupeRealmResponse>
  >
}

interface TreePart {
  tree: Computed<TreePart, TITreeItem[], LoupeModel>
}

interface IRhpPart {
  elementRelevance: IRhpState
  setElementRelevance: Action<IRhpPart, IRhpState>
  stageRelevance: IRhpState
  setStageRelevance: Action<IRhpPart, IRhpState>
  tree: IRhpState
  setTree: Action<IRhpPart, IRhpState>
  stages: IRhpState
  setStages: Action<IRhpPart, IRhpState>
  sections: IRhpState
  setSections: Action<IRhpPart, IRhpState>
  setAllUnlocked: Action<IRhpPart>
}

export interface BriefPerspectiveState {
  rhp: IRhpPart
  brief: Computed<BriefPerspectiveState, Section[], LoupeModel>
  filter: FilterPart
  filteredByStage: Computed<BriefPerspectiveState, Section[], LoupeModel>
  filteredBriefs: Computed<BriefPerspectiveState, Section[], LoupeModel>
  section: SectionPart
  element: ElementPart
  field: FieldPart
  template: BriefTemplatePart
  tree: TreePart
}

export const briefPerspective: BriefPerspectiveState = {
  rhp: {
    elementRelevance: {},
    setElementRelevance: action((state, payload) => {
      state.elementRelevance = {
        ...state.elementRelevance,
        ...filterRhpPayload(state.elementRelevance.locked, payload),
      }
    }),
    stageRelevance: {},
    setStageRelevance: action((state, payload) => {
      state.stageRelevance = {
        ...state.stageRelevance,
        ...filterRhpPayload(state.stageRelevance.locked, payload),
      }
    }),
    tree: {},
    setTree: action((state, payload) => {
      state.tree = {
        ...state.tree,
        ...filterRhpPayload(state.tree.locked, payload),
      }
    }),
    stages: {},
    setStages: action((state, payload) => {
      state.stages = {
        ...state.stages,
        ...filterRhpPayload(state.stages.locked, payload),
      }
    }),
    sections: {},
    setSections: action((state, payload) => {
      state.sections = {
        ...state.sections,
        ...filterRhpPayload(state.sections.locked, payload),
      }
    }),
    setAllUnlocked: action(state => {
      Object.keys(state).forEach(key => (state[key].locked = undefined))
    }),
  },
  brief: computed(
    [
      (_, globalState) => globalState.project.briefs.all,
      (_, globalState) => globalState.project.current,
    ],
    (brief, project) => {
      const sections = brief.map(section => {
        // Sort section.elements by section.elementsOrder (array of ids)
        const groupById = groupBy(prop('id'), section.elements)
        section.elements = section.elementsOrder.map(
          (id: string) => groupById[id][0]
        )
        return section
      })

      // Sort the sections
      if (project && project.sectionsOrder.length > 0) {
        // sort the sections
        const order = project.sectionsOrder
        const sortSections = (s1: Section, s2: Section) =>
          order.findIndex(s => s === s1.id) -
            order.findIndex(s => s === s2.id) || -1 // gak!
        return sort(sortSections, sections)
      } else {
        // just return the sections
        return sections
      }
    }
  ),
  filter: {
    current: { stageFilter: [], sectionFilter: [], treeFilter: [] },
    set: action((state, payload) => {
      state.current = payload
    }),
  },
  filteredByStage: computed(
    [state => state.filter.current, state => state.brief],
    (filter, brief) =>
      filter.stageFilter.length > 0
        ? brief.filter(
            section =>
              intersection(section.stageIds, filter.stageFilter).length > 0
          )
        : brief
  ),
  filteredBriefs: computed(
    [
      (_, globalState) => globalState.project.tree.rootTD,
      state => state.filter.current,
      state => state.brief,
    ],
    (rootTD, filter, brief) =>
      rootTD ? briefFilter(rootTD, filter, brief) : brief
  ),
  section: {
    current: undefined,
    set: action((state, payload) => {
      console.log('Set section', payload)
      state.current = payload
    }),
    create: thunk((_, { section, positionIndex }, { getStoreState }) => {
      return new Promise((resolve, reject) => {
        const ctx = getStoreState().user.seats.current
        const project = getStoreState().project.current
        if (!project) {
          const e = {
            status: 'error',
            message: 'No current project to create section within',
          }
          console.error(e)
          return reject(e as LoupeRealmErrorResponse)
        }

        const args = { projectId: project.id, positionIndex }
        ipcCreate(
          ctx,
          section,
          'Section',
          (_event, response) => {
            console.log('Created section', section)
            response.status === 'success' ? resolve(response) : reject(response)
          },
          args
        )
      })
    }),
    clear: action(state => {
      state.current = undefined
    }),
    update: thunk((_, payload, { getStoreState }) => {
      return new Promise((resolve, reject) => {
        const ctx = getStoreState().user.seats.current
        ipcUpdate(ctx, payload, 'Section', (event, response) => {
          console.log('Update Section stuff happened!', event, response)
          response.status === 'success' ? resolve(response) : reject(response)
        })
      })
    }),
    delete: thunk((_, payload, { getStoreState }) => {
      return new Promise((resolve, reject) => {
        const ctx = getStoreState().user.seats.current
        ipcDelete(ctx, payload, 'Section', (event, response) => {
          console.log('Update Section stuff happened!', event, response)
          response.status === 'success' ? resolve(response) : reject(response)
        })
      })
    }),
    getIndex: computed(
      [(_, globalState) => globalState.briefPerspective.brief],
      sections => sectionId => findIndex(propEq('id', sectionId))(sections) || 0
      // This is a selector that takes a section ID and gives back the index number in the sort order of this ID in the global context
    ),
  },
  element: {
    current: undefined,
    set: action((state, payload) => {
      state.current = payload
    }),
    create: thunk((_, { element, positionIndex }, { getStoreState }) => {
      return new Promise((resolve, reject) => {
        const ctx = getStoreState().user.seats.current
        const args = { positionIndex }
        ipcCreate(
          ctx,
          element,
          'Element',
          (_event, response) => {
            response.status === 'success' ? resolve(response) : reject(response)
          },
          args
        )
      })
    }),
    clear: action(state => {
      state.current = undefined
    }),
    delete: thunk((_, payload, { getStoreState }) => {
      return new Promise((resolve, reject) => {
        const ctx = getStoreState().user.seats.current
        ipcDelete(ctx, payload, 'Element', (event, response) => {
          console.log('Delete Element stuff happened!', event, response)
          response.status === 'success' ? resolve(response) : reject(response)
        })
      })
    }),
    update: thunk((_, payload, { getStoreState }) => {
      return new Promise((resolve, reject) => {
        const ctx = getStoreState().user.seats.current
        ipcUpdate(ctx, payload, 'Element', (event, response) => {
          console.log('Update Element stuff happened!', event, response)
          response.status === 'success' ? resolve(response) : reject(response)
        })
      })
    }),
    updateElementData: thunk((_, payload, { getStoreState }) => {
      const ctx = getStoreState().user.seats.current
      return new Promise((resolve, reject) => {
        ipcUpdate(ctx, payload, 'ElementData', (_event, response) => {
          response.status === 'success' ? resolve(response) : reject(response)
        })
      })
    }),
    updateRelevance: thunk((state, payload, { getStoreState }) => {
      const ctx = getStoreState().user.seats.current
      return new Promise((resolve, reject) => {
        updateElementRelevance(ctx, payload, (_, response) => {
          if (response.status === 'success') {
            state.set(response.data)
            resolve(response)
          } else {
            reject(response)
          }
        })
      })
    }),
  },
  field: {
    createDefinition: thunk((_, payload, { getStoreState }) => {
      const ctx = getStoreState().user.seats.current
      return new Promise((resolve, reject) => {
        ipcCreate(ctx, payload, 'FieldDefinition', (event, response) => {
          console.log(
            'Create Field Definition stuff happened!',
            event,
            response
          )
          response.status === 'success' ? resolve(response) : reject(response)
        })
      })
    }),
    deleteDefinition: thunk((_, payload, { getStoreState }) => {
      const ctx = getStoreState().user.seats.current
      return new Promise((resolve, reject) => {
        ipcDelete(ctx, payload, 'FieldDefinition', (event, response) => {
          console.log(
            'Delete Field Definition stuff happened!',
            event,
            response
          )
          response.status === 'success' ? resolve(response) : reject(response)
        })
      })
    }),
    updateDefinition: thunk((_, payload, { getStoreState }) => {
      const ctx = getStoreState().user.seats.current
      return new Promise((resolve, reject) => {
        ipcUpdate(ctx, payload, 'FieldDefinition', (event, response) => {
          console.log(
            'Update Field Definition stuff happened!',
            event,
            response
          )
          response.status === 'success' ? resolve(response) : reject(response)
        })
      })
    }),
    updateValue: thunk((_, payload, { getStoreState }) => {
      const ctx = getStoreState().user.seats.current
      return new Promise((resolve, reject) => {
        ipcUpdate(ctx, payload, 'FieldValue', (event, response) => {
          console.log('Update Field Value stuff happened!', event, response)
          response.status === 'success' ? resolve(response) : reject(response)
        })
      })
    }),
  },
  template: {
    saveBriefTemplate: thunk((_, payload, { getStoreState }) => {
      const ctx = getStoreState().user.seats.current
      const project = getStoreState().project.current
      const projectId = payload.projectId || (project && project.id)
      return new Promise((resolve, reject) => {
        if (projectId) {
          ipcCreate(
            ctx,
            { projectId, ...payload },
            'Template',
            (event, response) => {
              console.log('Saving Brief Template', event, response)
              response.status === 'success'
                ? resolve(response)
                : reject(response)
            }
          )
        } else {
          reject({
            status: 'error',
            message: 'Could not determine project id to create template from',
          })
        }
      })
    }),
  },
  tree: {
    tree: computed(
      [
        (_, storeState) => storeState.project.tree.rootTD,
        (_, storeState) => storeState.briefPerspective.element.current,
      ],
      (rootTd, element) => {
        if (!rootTd) {
          return []
        }
        return element
          ? rootTd.instances[0].children.map(ti =>
              tiToTreeItem(ti, (relTi: TreeInstance) => {
                return element.isFieldSet
                  ? !!nestedRelators(element, rootTd, relTi).length
                  : hasTiRelevance(element, relTi.id)
              })
            )
          : rootTd.instances[0].children.map(ti => tiToTreeItem(ti))
      }
    ),
  },
}
