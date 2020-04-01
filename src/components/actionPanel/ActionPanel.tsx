import * as React from 'react'
import { Heading, Button, Box, Checkbox, Flex, PopOver } from '../shared'
import { theme } from '../shared/Theme/theme'

export const ActionPanel = () => {
  return (
    <Box p={theme.s2} bg={theme.grayDark} bt={theme.darkStroke}>
      <Flex align='center' justify='flex-end' direction='row'>
        <Checkbox checked={false}>Test checkbox</Checkbox>
        <Checkbox checked={true}>Test checkbox 2</Checkbox>
        <Button text iconLeft='message' color={theme.grayLight}>
          Text
        </Button>
        <Button secondary color={theme.grayLight} ml={theme.s2}>
          Secondary
        </Button>
        <Button disabled ml={theme.s2}>
          Disabled
        </Button>
        <PopOver
          pointerRight='15px'
          width='400px'
          content={
            <Heading color='black' xlarge>
              This is a test popover
            </Heading>
          }
        >
          <Button iconRight='right-arrow' ml={theme.s2}>
            Primary
          </Button>
        </PopOver>
      </Flex>
    </Box>
  )
}
