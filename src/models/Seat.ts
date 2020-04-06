import { Team } from '@models/Team'
import { StagePermission } from '@models/StagePermission'
import { ProjectPermission } from '@models/ProjectPermission'
import { Repository } from '@models/Repository'

//
// The canonical definition of a Seat (the level of nesting defined here will
// be the form used to send over IPC, stored in redux and pass into React
// components as props)
//
export interface Seat {
  readonly id: string
  readonly model: string
  userId: string
  team: Team
  stagePermissions: StagePermission[]
  projectPermissions: ProjectPermission[]
  repositories: Repository[]
}
