import * as React from 'react'
import { Avatar, Box, Text, Subsection, Flex } from '../../../shared'
import { theme } from '../../../shared/Theme/theme'

export const WorkflowGroupsPane = () => (
  <Flex direction='column'>
    <Subsection showAvatar heading='Art Directors' subtitle='16 Users'>
      <Box mb={theme.s3} width='100%'>
        <Flex align='center'>
          <Avatar mr={theme.s2} image='https://www.fillmurray.com/96/96' />
          <Text mb='0' body>
            Jake Ranallo
          </Text>
        </Flex>
      </Box>
      <Box mb={theme.s3} width='100%'>
        <Flex align='center'>
          <Avatar mr={theme.s2} image='https://www.fillmurray.com/96/96' />
          <Text mb='0' body>
            Jake Ranallo
          </Text>
        </Flex>
      </Box>
      <Box mb={theme.s3} width='100%'>
        <Flex align='center'>
          <Avatar mr={theme.s2} image='https://www.fillmurray.com/96/96' />
          <Text mb='0' body>
            Jake Ranallo
          </Text>
        </Flex>
      </Box>
    </Subsection>
    <Subsection showAvatar heading='Art Directors' subtitle='16 Users'>
      <Box mb={theme.s3} width='100%'>
        <Flex align='center'>
          <Avatar mr={theme.s2} image='https://www.fillmurray.com/96/96' />
          <Text mb='0' body>
            Jake Ranallo
          </Text>
        </Flex>
      </Box>
      <Box mb={theme.s3} width='100%'>
        <Flex align='center'>
          <Avatar mr={theme.s2} image='https://www.fillmurray.com/96/96' />
          <Text mb='0' body>
            Jake Ranallo
          </Text>
        </Flex>
      </Box>
      <Box mb={theme.s3} width='100%'>
        <Flex align='center'>
          <Avatar mr={theme.s2} image='https://www.fillmurray.com/96/96' />
          <Text mb='0' body>
            Jake Ranallo
          </Text>
        </Flex>
      </Box>
    </Subsection>
  </Flex>
)
