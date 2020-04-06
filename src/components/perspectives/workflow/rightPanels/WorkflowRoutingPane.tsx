import * as React from 'react'
import { Stage } from '@models/Stage'
import { StageTransition } from '@models/StageTransition'
import { Box, Icon, Text, Flex, InlineEdit } from '@components/shared'
import { theme } from '@components/shared/Theme/theme'
import { typePicker } from '@helpers/typePicker'

export interface IRoutingPane {
  stage?: Stage
  stages?: Stage[]
  saveTransitionName: (node: StageTransition, newName: string) => void
}

export const WorkflowRoutingPane = ({
  stage,
  stages,
  saveTransitionName,
}: IRoutingPane) => {
  return (
    <Box m={theme.s3}>
      {(stage && stage.inputs) || (stage && stage.outputs) ? (
        <>
          {stage.inputs.length >= 1 && (
            <Text subtitle mb={theme.s2} color={theme.grayLight}>
              Receives From:
            </Text>
          )}
          <Box mb={theme.s2}>
            {stage.inputs.map(i => (
              <Flex key={i.id} direction='column'>
                <Box>
                  {stages &&
                    stages
                      .filter(s => s.id === i.sourceStageId)
                      .map((s: Stage) => {
                        const type = typePicker(s.name)
                        return (
                          <Box key={stage.id} color={type.color}>
                            <Flex>
                              <Icon width='24px' name={type.icon} />
                              <Text body mb='0' color='inherit'>
                                {s.name} Stage
                              </Text>
                            </Flex>
                          </Box>
                        )
                      })}
                </Box>
                <InlineEdit
                  p={theme.s2}
                  minimal
                  saveContent={newName => saveTransitionName(i, newName)}
                >
                  <Text subtitle mb='0'>
                    {i.name}
                  </Text>
                </InlineEdit>
              </Flex>
            ))}
          </Box>
          {stage.outputs.length >= 1 && (
            <Text mb={theme.s2} subtitle color={theme.grayLight}>
              Sends To:
            </Text>
          )}
          {stage.outputs.map(o => (
            <Flex key={o.id} direction='column'>
              <Box>
                {stages &&
                  stages
                    .filter(s => s.id === o.destinationStageId)
                    .map((s: Stage) => {
                      const type = typePicker(s.name)
                      return (
                        <Box key={stage.id} color={type.color}>
                          <Flex>
                            <Icon width='24px' name={type.icon} />
                            <Text body mb='0' color='inherit'>
                              {s.name} Stage
                            </Text>
                          </Flex>
                        </Box>
                      )
                    })}
              </Box>
              <InlineEdit
                p={theme.s2}
                minimal
                saveContent={newName => saveTransitionName(o, newName)}
              >
                <Text subtitle mb='0'>
                  {o.name}
                </Text>
              </InlineEdit>
            </Flex>
          ))}
        </>
      ) : (
        <Text mb='0' body color='white'>
          No transitions added yet.
        </Text>
      )}
    </Box>
  )
}
