export interface Project {
  readonly id: string
  readonly model: string
  name: string
  teamId: string
  sectionsOrder: string[]
}

export interface NewProjectOptions {
  name?: string
  projectTemplate?: string
  briefTemplate?: string
  treeTemplate?: string
  workflowTemplate?: string
}
