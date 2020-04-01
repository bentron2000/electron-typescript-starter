import { Computed, computed } from 'easy-peasy'
import { Section } from '@models'
import { LoupeModel } from '..'
import { briefFilter } from '@components/helpers'
import { BriefFilter } from '../BriefPerspectiveState'

export interface IBriefPart {
  filters: Computed<IBriefPart, BriefFilter, LoupeModel>
  filteredBrief: Computed<IBriefPart, Section[], LoupeModel>
}

export const briefPart: IBriefPart = {
  filters: computed(
    [
      (_, storeState) => storeState.assetPerspective.filter.current.treeFilter,
      (_, storeState) => storeState.assetPerspective.stage.current,
    ],
    (treeFilter, stage) => {
      return {
        treeFilter,
        stageFilter: stage ? [stage.id] : [],
        sectionFilter: [],
      }
    }
  ),
  filteredBrief: computed(
    [
      (_, storeState) => storeState.project.tree.rootTD,
      state => state.filters,
      (_, storeState) => storeState.briefPerspective.brief,
    ],
    (rootTD, filters, brief) => {
      return rootTD ? briefFilter(rootTD, filters, brief) : brief
    }
  ),
}
