import * as React from 'react'
import styled from 'styled-components'
import { useStoreActions } from '@redux/store'
import { LoupeRealmErrorResponse } from '@models/ipc'
import {
  Button,
  Flex,
  Box,
  useToasts,
  theme
} from '@components/shared'

const AddBox = styled(Box)`
background-image: linear-gradient(90deg, rgba(41,47,58,0.00) 0%, #292F3A 50%);
position: absolute;
right: 0;
`

const AddBoxButton = styled(Button)`
height: 100%;
`

// Renders the add FieldDefinition button
export const HeaderAddDefinitionCell = ({ element }: { element: Element }) => {
  const { addToast } = useToasts()
  const createFieldDef = useStoreActions(a => a.briefPerspective.field.createDefinition)
  const handleCreateFieldDef = (elementId: string) => {
    createFieldDef({ elementId })
      .catch((err: LoupeRealmErrorResponse) =>
        addToast(err.message, { type: 'negative' })
      )
  }
  return (
    <AddBox height='100%'>
      <Flex height='100%' align='center' justify='center'>
        <AddBoxButton
          color={theme.grayLight}
          text
          iconLeft='add'
          onClick={() => handleCreateFieldDef(element.id)}
        >
          Add Field
        </AddBoxButton>
      </Flex>
    </AddBox>
  )
}
