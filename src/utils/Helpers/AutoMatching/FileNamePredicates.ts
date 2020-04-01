import {
  IAMPredicate,
  IAMPayloadFileName,
  IAMPredicateArray,
} from './autoMatch'
import { isPendingAssetOrMediaState } from './autoMatchingHelpers'
import { tIfilter, TreeInstance, tIgetBranch } from '@models/TreeInstance'
import leven from 'leven'

// const stringSplitter = (name: string) => {
//   // Possibly split on word boundaries if present with upcase?
//   const splitOn = ['.', '_', '-']
//   return [...new Set(splitOn.map(s => name.toLowerCase().split(s)).flat())]
// }

// const camelSplit = (str: string) => {
//   return str
//     .replace(/([A-Z]+)([A-Z][a-z])/g, ' $1 $2') // Look for long acronyms and filter out the last letter
//     .replace(/([a-z\d])([A-Z])/g, '$1 $2') // Look for lower-case letters followed by upper-case letters
//     .replace(/([a-zA-Z])(\d)/g, '$1 $2') // Look for lower-case letters followed by numbers
//     .replace(/^./, (str2: string) => {
//       return str2.toUpperCase()
//     })
//     .trim() // Remove any white space left around the word
//     .toLowerCase()
//     .split(' ') // Split into array
// }

// const pullApart = (value: string) => {
//   const a = stringSplitter(value)
//   const b = camelSplit(value)
//   const c = a.map(v => camelSplit(v)).flat()
//   const sorter = (x: string, y: string) => (x.length > y.length ? -1 : 1)
//   return [...new Set([...a, ...b, ...c])].sort(sorter)
// }

export const fileNamepredicates: IAMPredicateArray = [
  {
    id: 'pred1',
    name: 'File Name match to Tree Instance',
    description:
      'Excludes extension, tries option without trailing frame numbers',
    modifier: 1.1,
    valueGenerator(item) {
      const name = isPendingAssetOrMediaState(item) ? item.fileName : item.name
      return {
        predicateId: this.id,
        // name without any extension
        value: name.replace(/\.[^/.]+$/, ''),
      }
    },
    comparator(payload, context) {
      const findName = (ti: TreeInstance) => {
        const original = payload.value.toLowerCase()
        const noDigits = original.replace(/[-_\s]?\d+$/, '')
        const tiName = ti.name.toLowerCase()
        return ti.mediaAllowed && (tiName === original || tiName === noDigits)
      }
      const matches = tIfilter(context.instances, findName)
      return matches.map(m => {
        return {
          assignment: m,
          newInstances: [],
          totalWeight: 1 * this.modifier,
        }
      })
    },
  } as IAMPredicate<IAMPayloadFileName>,
  {
    id: 'pred2',
    name: 'Use Levenshtein distance to match to Tree Instances', // Tree Definition names
    description: 'description',
    modifier: 1,
    valueGenerator(item) {
      const name = isPendingAssetOrMediaState(item) ? item.fileName : item.name
      return {
        predicateId: this.id,
        value: name.replace(/\.[^/.]+$/, ''), // name without any extension
      }
    },
    comparator(payload, context) {
      const MATCHESTORETURN = 4
      const mediaAallowedTIs = tIfilter(
        context.instances,
        ti => ti.mediaAllowed
      )
      const chain = mediaAallowedTIs
        .map(ti =>
          tIgetBranch(context.instances, ti).map(c => {
            return {
              ti,
              name: c.name,
              confidence: 1 / leven(c.name, payload.value),
            }
          })
        )
        .flat()
        .sort((a, b) => (a.confidence > b.confidence ? -1 : 1))
        .slice(0, MATCHESTORETURN)

      console.log(payload.value)
      console.table(chain)

      return chain.map(c => {
        return {
          assignment: c.ti,
          newInstances: [],
          totalWeight: c.confidence * this.modifier,
        }
      })
    },
  } as IAMPredicate<IAMPayloadFileName>,
]
