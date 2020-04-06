import * as React from 'react'

import { Match, Matches } from '@models/Match'
import { PendingAsset } from '@models/PendingAsset'

import {
  Box,
  Asset,
  Grid,
  Text,
  Collapsible,
  Button,
  Icon,
} from '@components/shared'
import { theme } from '@components/shared/Theme/theme'
import { useGridSelect } from '@components/helpers/useGridSelect'
import {
  createContext,
  generateCompareFunc,
} from '@utils/Helpers/AutoMatching/autoMatch'
import { useStoreState } from '@redux/store'

import { fileNamepredicates } from '@utils/Helpers/AutoMatching/FileNamePredicates'

interface MatchedPanel {
  match: Match
  zoom: number
  addMatch: (match: Match) => void
  removeMatch: (match: Match) => void
}

const MatchedPanel = (props: MatchedPanel) => {
  const [selected, onSelect] = useGridSelect(props.match.assets)
  const handleUnMatch = () => {
    if (selected.length === props.match.assets.length) {
      props.removeMatch(props.match)
    } else {
      // TODO : figure out how to clear 'selected' after this action :/
      props.addMatch({
        ...props.match,
        assets: props.match.assets.filter(a => !selected.includes(a)),
      })
    }
  }
  return (
    <Collapsible
      key={props.match.id}
      size='small'
      heading={props.match.assignment.name}
      controls={
        selected.length > 0 && (
          <Button color={theme.red} text onClick={() => handleUnMatch()}>
            Unmatch&nbsp;Selected
          </Button>
        )
      }
      bg={theme.sectionGreyDarker}
    >
      <Grid zoom={props.zoom}>
        {props.match.assets.map(item => (
          <Asset
            src={item.thumbnail}
            key={item.id}
            onClick={event => onSelect(item, event)}
            selected={selected.includes(item)}
            confirmed={
              <>
                <Box mb={theme.s2} color='white'>
                  <Icon name='tick' width='64px' />
                </Box>
                <Text subtitle color='white' mb='0'>
                  Matched Manually
                </Text>
              </>
            }
            actionIcon='tick'
          />
        ))}
      </Grid>
    </Collapsible>
  )
}

export interface MatchingLeftPanel {
  unmatchedAssets: PendingAsset[]
  selected: PendingAsset[]
  setSelected: (
    item: PendingAsset,
    event: React.MouseEvent<HTMLElement>
  ) => void
  zoom: number
  matches: Matches
  addMatch: (payload: Match) => void
  removeMatch: (payload: Match) => void
}

export const MatchingLeftPanel = ({
  unmatchedAssets,
  selected,
  setSelected,
  zoom,
  matches,
  addMatch,
  removeMatch,
}: MatchingLeftPanel) => {
  const matchesLength = [...Object.values(matches)].flatMap(m => m.assets)
    .length

  const stageId = useStoreState(s => s.assetPerspective.stage.currentStageId)
  const predicates = fileNamepredicates

  const doTheThing = () => {
    if (stageId) {
      const matchContext = createContext(stageId, {
        predicates,
        otherOptions: 'lalalala',
      })
      if (matchContext) {
        const compare = generateCompareFunc(matchContext)
        const results = unmatchedAssets.map(compare).flat()
        console.log('results', results)
        return results.length
      } else {
        return 0
      }
    } else {
      return 0
    }
  }

  return (
    <>
      <Box>
        <Text body>See log for possible matches</Text>
        <Text body>{`Number of Matches: ${doTheThing()}`}</Text>
      </Box>

      {Object.keys(matches).length > 0 && (
        <Collapsible
          heading={
            unmatchedAssets.length > 0
              ? `${matchesLength} ${
                  matchesLength > 1 ? 'Assets' : 'Asset'
                } Matched`
              : 'All Assets Matched'
          }
          // Should display full path -> Womenswear / Handbags / etc...
          expanded={false}
          border={theme.green}
          size='small'
          color={theme.green}
          editable={false}
        >
          <Box width='100%' height='auto'>
            {[...Object.values(matches)].map(match => (
              <MatchedPanel
                match={match}
                zoom={zoom}
                key={match.id}
                addMatch={addMatch}
                removeMatch={removeMatch}
              />
            ))}
          </Box>
        </Collapsible>
      )}

      <Box />
      {unmatchedAssets.length > 0 && (
        <Collapsible
          heading={`${unmatchedAssets.length} ${
            unmatchedAssets.length > 1 ? 'Assets' : 'Asset'
          } Unmatched`}
          size='small'
          editable={false}
        >
          <Grid zoom={zoom}>
            {/* When filtering/sorting we get different layouts here... */}
            {unmatchedAssets.map(item => (
              <Asset
                src={item.thumbnail}
                key={item.id}
                onClick={event => setSelected(item, event)}
                selected={selected.includes(item)}
              />
            ))}
          </Grid>
        </Collapsible>
      )}
    </>
  )
}
