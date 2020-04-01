import * as React from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router'

import { useStoreState, useStoreActions } from '@redux/store'
import { Perspective } from '@redux/state/AppState'

import { Avatar, TabButton, Flex, Box, theme } from '@components/shared'

export interface PerspectiveLinkButton {
  projectId: string
  perspective?: Perspective[]
  icon?: string
  active: boolean | undefined
  buttonAction: () => void
  link: string
}

const PerspectiveLinkButton = (props: PerspectiveLinkButton) => {
  return (
    <Link
      to={props.link}
      onClick={() => {
        props.buttonAction()
      }}
    >
      <TabButton isActive={props.active} icon={props.icon} />
    </Link>
  )
}

export interface PerspectivePanel {}

export const PerspectivePanel = () => {
  const hist = useHistory()
  const perspectives = useStoreState(store => store.app.perspectives)
  const setActive = useStoreActions(a => a.app.setCurrentPerspective)
  const project = useStoreState(store => store.project.current)

  let linkButtons
  if (project) {
    linkButtons = perspectives
      .filter((perspective: Perspective) => perspective.id !== 'dashboard')
      .map((perspective: Perspective) => {
        const path = `/project/${project.id}/${perspective.id}`
        const action = () => {
          hist.push(path)
          setActive(perspective.id)
        }
        return {
          id: project.id,
          active: path === hist.location.pathname,
          icon: perspective.id,
          buttonAction: action,
          link: path,
        }
      })
  }

  return (
    <Box bg={theme.grayDarker}>
      <Flex
        direction='column'
        width='80px'
        height='100%'
        justify='space-between'
      >
        <Box>
          {linkButtons
            ? linkButtons.map(
                (
                  item: {
                    id: string
                    icon: string
                    active: boolean | undefined
                    buttonAction: () => void
                    link: string
                  },
                  index: number
                ) => {
                  return (
                    <PerspectiveLinkButton
                      key={index}
                      icon={item.icon}
                      projectId={item.id}
                      active={item.active}
                      buttonAction={item.buttonAction}
                      link={item.link}
                    />
                  )
                }
              )
            : ''}
        </Box>
        <Box m={theme.s3}>
          <Avatar
            large
            image='https://www.fillmurray.com/96/96'
            notifications={22}
          />
        </Box>
      </Flex>
    </Box>
  )
}
