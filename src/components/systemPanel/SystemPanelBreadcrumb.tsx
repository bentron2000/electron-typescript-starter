import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import styled, { css, StyledComponent } from 'styled-components'

import { useStoreActions } from '@redux/store'
import { Team } from '@models/Team'
import { Project } from '@models/Project'

import { theme } from '@components/shared/Theme/theme'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbItemButton,
  LeftDivider,
  IBreadcrumbItem,
  IBreadcrumbItemContent,
  Select,
  Avatar,
  Flex,
} from '@components/shared'

const bcHoverColor = theme.elementLightGrey

const SystemPanelBreadcrumbItem = styled(BreadcrumbItem)`
  background: ${theme.grayDark};
  &.project {
    button {
      cursor: default;
    }
  }
  :hover:first-child {
    background: ${bcHoverColor};
  }
  :hover {
    button {
      background: ${(props: IBreadcrumbItem) =>
        props.last
          ? `linear-gradient(to right, ${bcHoverColor}, 80%, transparent);`
          : `${bcHoverColor};`};
    }
    #Rectangle-6 {
      fill: ${bcHoverColor};
    }
    select {
      background: ${bcHoverColor};
    }
  }
  // Sets the background of the next elements li container so the
  // transparent section of the SVG LeftDivider appears hovered.
  :hover + li {
    background: ${bcHoverColor};
  }
  :hover + li:last-child {
    // Create a hard gradient line so the angled divider of the next breadcrumb item has a hover
    // effect applied without any visible effects on its gradient.
    background: linear-gradient(
      to right,
      ${bcHoverColor},
      ${bcHoverColor} 30%,
      transparent 30%,
      transparent 100%
    );
  }
  ${(props: IBreadcrumbItem) =>
    props.last &&
    css`
      #Rectangle-6 {
        fill: ${bcHoverColor};
      }
    `}
`

const SystemPanelBreadcrumbItemButton = styled(BreadcrumbItemButton)`
  background: ${theme.grayDark};
  font-size: 13px;
  color: #697683;
  text-transform: uppercase;
  ${(props: IBreadcrumbItem) =>
    !props.first &&
    css`
      // Adjustment needed on button when <LeftDivider> SVG is rendered
      margin-top: -2px;
    `}
  ${(props: IBreadcrumbItem) =>
    props.last &&
    css`
      background: linear-gradient(to right, ${bcHoverColor}, 80%, transparent);
    `}
`

const SystemPanelBreadcrumbTeamSelect = styled(Select)`
  background: none;
  :hover {
    background: none;
  }
  select {
    height: 39px;
    color: ${theme.textLight};
    font: 500 13px/24px ${theme.primaryFont};
    letter-spacing: 1.8px;
    text-transform: uppercase;
    padding-left: 16px;
    border-radius: 0;
    :hover {
      background: none;
    }
  }
`

const SystemPanelAvatar = styled(Avatar)`
  margin: 0 0 1px 24px;
  cursor: pointer;
`

interface ISystemPanelBreadcrumbItemContent
  extends Omit<IBreadcrumbItemContent, 'children'> {
  button?: StyledComponent<any, any, IBreadcrumbItem, never>
  buttonContent: JSX.Element | JSX.Element[]
  avatar?: JSX.Element
  onSelect?: (arg?: any) => void
  children?: any
}

const SystemPanelBreadcrumbItemContent = ({
  button: Button = SystemPanelBreadcrumbItemButton,
  buttonContent,
  avatar,
  onSelect,
  children,
  ...props
}: ISystemPanelBreadcrumbItemContent) => {
  return (
    <>
      {!props.first && <LeftDivider color={theme.grayDark} />}
      {avatar}
      <Button
        onClick={() => onSelect && onSelect()}
        handleChange={onSelect}
        {...props}
      >
        {children || buttonContent}
      </Button>
    </>
  )
}

export interface ISystemPanelBreadcrumb {
  team: Team
  teams: Team[]
  setTeam: (team: Team) => void
  project: Project
}

export const SystemPanelBreadcrumb = withRouter(
  ({
    history,
    team,
    teams,
    setTeam,
    project,
  }: ISystemPanelBreadcrumb & RouteComponentProps) => {
    const setRightPanelTitle = useStoreActions(a => a.app.setRightPanelTitle)
    const handleProjectSelect = () => {
      history.push('/dashboard')
      setRightPanelTitle('Dashboard')
    }
    const handleTeamSelect = (teamName: string) => {
      const selectedTeam = teams.find(t => t.name === teamName)
      if (selectedTeam) {
        setTeam(selectedTeam)
        history.push('/dashboard')
        setRightPanelTitle('Dashboard')
      }
    }

    return (
      <Breadcrumb>
        <SystemPanelBreadcrumbItem>
          {(bciProps: IBreadcrumbItemContent) => (
            <Flex align='center'>
              <SystemPanelBreadcrumbItemContent
                button={SystemPanelBreadcrumbTeamSelect}
                buttonContent={
                  teams ? (
                    teams.map(t => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))
                  ) : (
                    <option>No Teams...</option>
                  )
                }
                onSelect={handleTeamSelect}
                avatar={
                  <SystemPanelAvatar name={team && team.name} square={true} />
                }
                {...bciProps}
              />
            </Flex>
          )}
        </SystemPanelBreadcrumbItem>
        <SystemPanelBreadcrumbItem>
          {(bciProps: IBreadcrumbItemContent) => (
            <SystemPanelBreadcrumbItemContent
              buttonContent={<span>Projects</span>}
              onSelect={handleProjectSelect}
              {...bciProps}
            />
          )}
        </SystemPanelBreadcrumbItem>
        {project && (
          <SystemPanelBreadcrumbItem className='project'>
            {(bciProps: IBreadcrumbItemContent) => (
              <SystemPanelBreadcrumbItemContent
                buttonContent={<span>{project.name}</span>}
                {...bciProps}
              />
            )}
          </SystemPanelBreadcrumbItem>
        )}
      </Breadcrumb>
    )
  }
)
