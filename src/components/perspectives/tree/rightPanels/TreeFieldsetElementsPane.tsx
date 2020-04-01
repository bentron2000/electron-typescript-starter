import * as React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import {
  Element,
  TreeInstance,
  TreeDefinition,
  FieldDefinition,
  FieldValue,
  Project,
  ElementData,
} from '@models'
import {
  Flex,
  Text,
  Input,
  Box,
  Heading,
  RelevanceLabel,
  Subsection,
} from '@components/shared'
import { theme } from '../../../shared/Theme/theme'
import { relatedElementData } from '@models/Element'

interface ITreeFieldsetPane {
  project: Project
  elements: Element[]
  selectedTI: TreeInstance
  rootTD: TreeDefinition
  setBriefPerspective: () => void
}

interface IFieldsetData
  extends Pick<
    ITreeFieldsetPane,
    'project' | 'rootTD' | 'setBriefPerspective'
  > {
  element: Element
  search?: string
}

interface IFieldsetDefinition extends IFieldsetData {}

interface IFieldsetInstance extends IFieldsetData {
  relatedEd: ElementData
  selectedTI: TreeInstance
}

const LinkBlock = styled(Flex)`
  padding: ${theme.s2};
  background-color: ${theme.grayDark};
  border-radius: 4px;
  justify-content: space-between;
  color: white;
  transition: background-color 200ms;
  :hover {
    background-color: #394254;
  }
`

const EllipsisText = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const FieldsetDefinitionRelevance = ({
  element,
  project,
  rootTD,
  setBriefPerspective,
  search = '',
}: IFieldsetDefinition) => {
  // Filters FDs by search query
  const [filteredFds, setFilteredFds] = React.useState(element.fieldDefinitions)

  React.useEffect(() => {
    const fds = search
      ? element.fieldDefinitions.filter(fd =>
          fd.name.toLowerCase().includes(search)
        )
      : element.fieldDefinitions
    setFilteredFds(fds)
  }, [element, search])

  return (
    <Flex direction='column'>
      <RelevanceLabel element={element} rootTd={rootTD} />
      {!filteredFds.length ? (
        <Box bg={theme.grayDarker} p={theme.s2} m={`${theme.s3} 0`}>
          <Text small mb='0' color={theme.grayLight}>
            <i>No fields added yet.</i>
          </Text>
        </Box>
      ) : (
        <ol style={{ paddingLeft: '0' }}>
          {filteredFds.map(fd => {
            const state = {
              linkToIds: [element.id, fd.id],
              callbacks: [setBriefPerspective],
            }
            return (
              <Link
                key={fd.id}
                to={{ pathname: `/project/${project.id}/brief`, state }}
                style={{ textDecoration: 'none' }}
              >
                <LinkBlock mb={theme.s2}>
                  <Text mb='0' small>
                    {fd.name}
                  </Text>
                </LinkBlock>
              </Link>
            )
          })}
        </ol>
      )}
    </Flex>
  )
}

const filterFdsByQuery = (
  query: string,
  fds: FieldDefinition[],
  edFields?: FieldValue[]
) => {
  return fds.filter(fd => {
    const fv =
      edFields && edFields.find(fieldVal => fieldVal.definitionId === fd.id)
    return (
      fd.name.toLowerCase().includes(query) ||
      (fv && fv.value.toLowerCase().includes(query))
    )
  })
}

const FieldsetInstanceRelevance = ({
  element,
  project,
  rootTD,
  selectedTI,
  relatedEd,
  setBriefPerspective,
  search = '',
}: IFieldsetInstance) => {
  // Filters FDs by search query (FD / FV names)
  const [filteredFds, setFilteredFds] = React.useState(element.fieldDefinitions)

  React.useEffect(() => {
    const fds = search
      ? filterFdsByQuery(search, element.fieldDefinitions, relatedEd.fields)
      : element.fieldDefinitions
    setFilteredFds(fds)
  }, [element, selectedTI, search])

  return (
    <Flex direction='column'>
      <RelevanceLabel element={element} rootTd={rootTD} />
      <ol style={{ paddingLeft: '0' }}>
        {filteredFds.map(fd => {
          const fv = relatedEd.fields.find(fVal => fVal.definitionId === fd.id)
          const fdState = {
            linkToIds: [element.id, fd.id],
            callbacks: [setBriefPerspective],
          }
          return (
            <LinkBlock mb={theme.s2} key={fd.id}>
              <Link
                to={{
                  pathname: `/project/${project.id}/brief`,
                  state: fdState,
                }}
                style={{
                  textDecoration: 'none',
                  width: '50%',
                  overflow: 'hidden',
                }}
              >
                <EllipsisText
                  mb='0'
                  small
                  color={fv && fv.value ? theme.grayLight : 'white'}
                >
                  {fd.name}
                </EllipsisText>
              </Link>
              {fv && (
                <Link
                  to={{
                    pathname: `/project/${project.id}/brief`,
                    state: {
                      linkToIds: [element.id, fv.id],
                      callbacks: [setBriefPerspective],
                    },
                  }}
                  style={{
                    textDecoration: 'none',
                    width: '50%',
                    overflow: 'hidden',
                  }}
                >
                  <EllipsisText mb='0' small align='right'>
                    {fv.value}
                  </EllipsisText>
                </Link>
              )}
            </LinkBlock>
          )
        })}
      </ol>
    </Flex>
  )
}

export const TreeFieldsetPane = ({
  elements,
  project,
  rootTD,
  selectedTI,
  setBriefPerspective,
}: ITreeFieldsetPane) => {
  // Search bar state
  const [search, setSearch] = React.useState('')
  // Filters elements by search query (searches FD / FV names)
  const [filteredElements, setFilteredElements] = React.useState(elements)

  React.useEffect(() => {
    const els = search
      ? elements.filter(e => {
          const data = selectedTI && relatedElementData(e, selectedTI)
          return filterFdsByQuery(
            search,
            e.fieldDefinitions,
            data ? data.fields : undefined
          ).length
        })
      : elements
    setFilteredElements(els)
  }, [elements, selectedTI, search])

  return (
    <Box display='block'>
      <Flex direction='column' p='16px 16px 0 16px'>
        <Input
          flex
          label='search'
          icon='search'
          width='100%'
          onChange={value => setSearch(value.toLowerCase())}
          onChangeDebounceDuration={300}
          mb={theme.s2}
          placeholder={`Search fields...`}
        />
      </Flex>
      {filteredElements.length ? (
        <Flex direction='column'>
          {filteredElements.map(element => {
            const data = relatedElementData(element, selectedTI)
            return (
              <Subsection
                key={element.id}
                minimal
                expanded
                heading={
                  <Box width='100%' p='4px 0 4px 12px'>
                    <Heading mb='0' size='small'>
                      {element.name}
                    </Heading>
                  </Box>
                }
              >
                <Flex width='100%'>
                  <Box p='0 16px' width='100%'>
                    {selectedTI && data && data.fields.length ? (
                      <FieldsetInstanceRelevance
                        element={element}
                        project={project}
                        relatedEd={data}
                        rootTD={rootTD}
                        setBriefPerspective={setBriefPerspective}
                        selectedTI={selectedTI}
                        search={search}
                      />
                    ) : (
                      <FieldsetDefinitionRelevance
                        element={element}
                        project={project}
                        rootTD={rootTD}
                        setBriefPerspective={setBriefPerspective}
                        search={search}
                      />
                    )}
                  </Box>
                </Flex>
              </Subsection>
            )
          })}
        </Flex>
      ) : (
        <Box p='16px'>
          <Text small color='white'>
            No fields found
          </Text>
        </Box>
      )}
    </Box>
  )
}
