// @ts-nocheck

import Realm from 'realm'
import {
  TeamEntity,
  UserEntity,
  SeatEntity,
  ProjectEntity,
  StageEntity,
  ProjectPermissionEntity,
  StagePermissionEntity,
  SectionEntity,
  SectionPermissionEntity,
  TreeDefinitionEntity,
  TreeInstanceEntity,
  ElementEntity,
  // ElementDataEntity,
  StageTransitionEntity,
  RepositoryEntity,
  SubscriptionEntity,
  // MediaItemEntity
  // MediaStateEntity,
  // AssetEntity,
  // AssetLocationEntity,
} from '..'
export const createMockData = (db: Realm) => {
  // prettier-ignore

  // NB: When hand writing these entries, you'll get errors if you're linking to another
  // entry that has non-optional fields that have not been correctly initialised beforehand.
  // (i.e. ensure the thing you're linking to has already been defined)

  db.write(() => {
    // TEAMS
    type MockTeamEntity = Omit<TeamEntity, 'owners' | 'admins' | 'templates'>
    const team1: MockTeamEntity = db.create('Team', { id: 't1', name: 'Mon Purse', seats: [], projects: [] }, true )
    const team2: MockTeamEntity = db.create('Team', { id: 't2', name: 'Team 2', seats: [], projects: [] }, true )

    // USERS
    const user1: UserEntity = db.create('User', { id: 'u1', name: 'User 1', seats: [] }, true )
    const user2: UserEntity = db.create('User', { id: 'u2', name: 'User 2', seats: [] }, true )
    const user3: UserEntity = db.create('User', { id: 'u3', name: 'User 3', seats: [] }, true )

    // SEATS
    type MockSeatEntity = Omit<SeatEntity, 'sectionPermissions'>
    const seat1: MockSeatEntity = db.create( 'Seat', { id: 'se1', stagePermissions: [], projectPermissions: [], user: [], team: [], repositories: [] }, true )
    const seat2: MockSeatEntity = db.create( 'Seat', { id: 'se4', stagePermissions: [], projectPermissions: [], user: [], team: [], repositories: [] }, true )
    const seat3: MockSeatEntity = db.create( 'Seat', { id: 'se2', stagePermissions: [], projectPermissions: [], user: [], team: [], repositories: [] }, true )
    const seat4: MockSeatEntity = db.create( 'Seat', { id: 'se3', stagePermissions: [], projectPermissions: [], user: [], team: [], repositories: [] }, true )

    // Add seats to teams
    team1.seats.push(seat1, seat3, seat4)
    team2.seats.push(seat2)

    // Add seats to users
    user1.seats.push(seat1, seat2)
    user2.seats.push(seat3)
    user3.seats.push(seat4)

    // PROJECTS
    type MockProjectEntity = Omit<ProjectEntity, 'sections'>
    const project1: MockProjectEntity = db.create( 'Project', { id: 'p1', name: 'eCommerce Project', stages: [], treeDefinitions: [], team: [], projectPermissions: [], sectionsOrder: ['section5', 'section2', 'section6', 'section4', 'section1', 'section3'] }, true )
    const project2: MockProjectEntity = db.create( 'Project', { id: 'p2', name: 'Fancy Project', stages: [], treeDefinitions: [], team: [], projectPermissions: [], sectionsOrder: [] }, true )
    const project3: MockProjectEntity = db.create( 'Project', { id: 'p3', name: 'Stupendous Project', stages: [], treeDefinitions: [], team: [], projectPermissions: [], sectionsOrder: [] }, true )

    // Add Projects to teams
    team1.projects.push(project1, project2, project3)

    // STAGES
    // eCommerce Project
    const st1p1: StageEntity = db.create( 'Stage', { id: 'p1st1', name: 'Project Setup', type: 'Brief Stage', sectionPermissions: [], project: [], mediaStates: [], inputsAllowed: true, inputs: [], outputsAllowed: true, outputs: [], diagramConfig: '{"x":100,"y":0}', subscriptions: [] }, true )
    const st2p1: StageEntity = db.create( 'Stage', { id: 'p1st2', name: 'Shoot', type: 'Shoot Stage', sectionPermissions: [], project: [], mediaStates: [], inputsAllowed: true, inputs: [], outputsAllowed: true, outputs: [], diagramConfig: '{"x":100,"y":200}', subscriptions: [] }, true )
    const st3p1: StageEntity = db.create( 'Stage', { id: 'p1st3', name: 'Select', type: 'Select Stage', sectionPermissions: [], project: [], mediaStates: [], inputsAllowed: true, inputs: [], outputsAllowed: true, outputs: [], diagramConfig: '{"x":100,"y":400}', subscriptions: [] }, true )
    const st4p1: StageEntity = db.create( 'Stage', { id: 'p1st4', name: 'Markup', type: 'Markup Stage', sectionPermissions: [], project: [], mediaStates: [], inputsAllowed: true, inputs: [], outputsAllowed: true, outputs: [], diagramConfig: '{"x":500,"y":400}', subscriptions: [] }, true )
    const st5p1: StageEntity = db.create( 'Stage', { id: 'p1st5', name: 'Archive', type: 'Input Stage', sectionPermissions: [], project: [], mediaStates: [], inputsAllowed: true, inputs: [], outputsAllowed: true, outputs: [], diagramConfig: '{"x":500,"y":200}', subscriptions: [] }, true )
    const st6p1: StageEntity = db.create( 'Stage', { id: 'p1st6', name: 'Retouch', type: 'Subworkflow Stage', sectionPermissions: [], project: [], mediaStates: [], inputsAllowed: true, inputs: [], outputsAllowed: true, outputs: [], diagramConfig: '{"x":900,"y":400}', subscriptions: [] }, true )
    const st7p1: StageEntity = db.create( 'Stage', { id: 'p1st7', name: 'Client Review', type: 'Subworkflow Stage', sectionPermissions: [], project: [], mediaStates: [], inputsAllowed: true, inputs: [], outputsAllowed: true, outputs: [], diagramConfig: '{"x":500,"y":600}', subscriptions: [] }, true )
    const st8p1: StageEntity = db.create( 'Stage', { id: 'p1st8', name: 'QA', type: 'Markup Stage', sectionPermissions: [], project: [], mediaStates: [], inputsAllowed: true, inputs: [], outputsAllowed: true, outputs: [], diagramConfig: '{"x":900,"y":600}', subscriptions: [] }, true )
    const st9p1: StageEntity = db.create( 'Stage', { id: 'p1st9', name: 'Approved', type: 'Output Stage', sectionPermissions: [], project: [], mediaStates: [], inputsAllowed: true, inputs: [], outputsAllowed: true, outputs: [], diagramConfig: '{"x":100,"y":600}', subscriptions: [] }, true )

    // Other Projects
    const st1p2: StageEntity = db.create( 'Stage', { id: 'p2st1', name: 'Stage1', type: 'Markup Stage', sectionPermissions: [], project: [], mediaStates: [], inputsAllowed: true, inputs: [], outputsAllowed: true, outputs: [], subscriptions: [] }, true )
    const st2p2: StageEntity = db.create( 'Stage', { id: 'p2st2', name: 'Stage2', type: 'Output Stage', sectionPermissions: [], project: [], mediaStates: [], inputsAllowed: true, inputs: [], outputsAllowed: true, outputs: [], subscriptions: [] }, true )
    const st3p2: StageEntity = db.create( 'Stage', { id: 'p2st3', name: 'Stage3', type: 'Input Stage', sectionPermissions: [], project: [], mediaStates: [], inputsAllowed: true, inputs: [], outputsAllowed: true, outputs: [], subscriptions: [] }, true )
    const st1p3: StageEntity = db.create( 'Stage', { id: 'p3st1', name: 'Stage1', type: 'Select Stage', sectionPermissions: [], project: [], mediaStates: [], inputsAllowed: true, inputs: [], outputsAllowed: true, outputs: [], subscriptions: [] }, true )
    const st2p3: StageEntity = db.create( 'Stage', { id: 'p3st2', name: 'Stage2', type: 'Subworkflow Stage', sectionPermissions: [], project: [], mediaStates: [], inputsAllowed: true, inputs: [], outputsAllowed: true, outputs: [], subscriptions: [] }, true )
    const st3p3: StageEntity = db.create( 'Stage', { id: 'p3st3', name: 'Stage3', type: 'Shoot Stage', sectionPermissions: [], project: [], mediaStates: [], inputsAllowed: true, inputs: [], outputsAllowed: true, outputs: [], subscriptions: [] }, true )

    // Add Stages to projects
    project1.stages.push(st1p1, st2p1, st3p1, st4p1, st5p1, st6p1, st7p1, st8p1, st9p1)
    project2.stages.push(st1p2, st2p2, st3p2)
    project3.stages.push(st1p3, st2p3, st3p3)

    // STAGE TRANSITIONS
    const st1p1_st2p1: StageTransitionEntity = db.create( 'StageTransition', { id: 'st1p1_st2p1', name: 'Publish Project', sourceStage: [], destinationStage: [] }, true )
    const st2p1_st3p1: StageTransitionEntity = db.create( 'StageTransition', { id: 'st2p1_st3p1', name: 'Ready for Selection', sourceStage: [], destinationStage: [] }, true )
    const st5p1_st2p1: StageTransitionEntity = db.create( 'StageTransition', { id: 'st5p1_st2p1', name: 'Reuse Asset', sourceStage: [], destinationStage: [] }, true )
    const st3p1_st4p1: StageTransitionEntity = db.create( 'StageTransition', { id: 'st3p1_st4p1', name: 'Ready for Markup', sourceStage: [], destinationStage: [] }, true )
    const st4p1_st6p1: StageTransitionEntity = db.create( 'StageTransition', { id: 'st4p1_st6p1', name: 'Marked Up', sourceStage: [], destinationStage: [] }, true )
    const st6p1_st8p1: StageTransitionEntity = db.create( 'StageTransition', { id: 'st6p1_st8p1', name: 'Retouch Complete', sourceStage: [], destinationStage: [] }, true )
    const st8p1_st7p1: StageTransitionEntity = db.create( 'StageTransition', { id: 'st8p1_st7p1', name: 'Approved', sourceStage: [], destinationStage: [] }, true )
    const st7p1_st4p1: StageTransitionEntity = db.create( 'StageTransition', { id: 'st7p1_st4p1', name: 'Reject Asset', sourceStage: [], destinationStage: [] }, true )
    const st7p1_st9p1: StageTransitionEntity = db.create( 'StageTransition', { id: 'st7p1_st9p1', name: 'Approve Asset', sourceStage: [], destinationStage: [] }, true )

    // Add Transitions between stages
    st1p1.outputs.push(st1p1_st2p1)
    st2p1.inputs.push(st1p1_st2p1, st5p1_st2p1)
    st2p1.outputs.push(st2p1_st3p1)
    st3p1.inputs.push(st2p1_st3p1)
    st3p1.outputs.push(st3p1_st4p1)
    st4p1.inputs.push(st3p1_st4p1, st7p1_st4p1)
    st4p1.outputs.push(st4p1_st6p1)
    st5p1.outputs.push(st5p1_st2p1)
    st6p1.inputs.push(st4p1_st6p1)
    st6p1.outputs.push(st6p1_st8p1)
    st7p1.inputs.push(st8p1_st7p1)
    st7p1.outputs.push(st7p1_st4p1, st7p1_st9p1)
    st8p1.inputs.push(st6p1_st8p1)
    st8p1.outputs.push(st8p1_st7p1)
    st9p1.inputs.push(st7p1_st9p1)

    // PROJECT PERMISSIONS
    const pPerm1: ProjectPermissionEntity = db.create( 'ProjectPermission', { id: 'pPerm1', project: project1, seat: [], admin: true }, true )
    const pPerm2: ProjectPermissionEntity = db.create( 'ProjectPermission', { id: 'pPerm2', project: project3, seat: [] }, true )
    const pPerm3: ProjectPermissionEntity = db.create( 'ProjectPermission', { id: 'pPerm3', project: project1, seat: [], admin: true }, true )
    const pPerm4: ProjectPermissionEntity = db.create( 'ProjectPermission', { id: 'pPerm4', project: project2, seat: [] }, true )
    const pPerm5: ProjectPermissionEntity = db.create( 'ProjectPermission', { id: 'pPerm5', project: project2, seat: [] }, true )
    const pPerm6: ProjectPermissionEntity = db.create( 'ProjectPermission', { id: 'pPerm6', project: project3, seat: [] }, true )

    // Add Project Permissions to seats
    seat1.projectPermissions.push(pPerm1, pPerm2)
    seat2.projectPermissions.push(pPerm3, pPerm4)
    seat3.projectPermissions.push(pPerm5, pPerm6)

   // STAGE PERMISSIONS
    const stPerm1: StagePermissionEntity = db.create( 'StagePermission', { id: 'stPerm1', stage: st1p1, seat: [] }, true )
    const stPerm2: StagePermissionEntity = db.create( 'StagePermission', { id: 'stPerm2', stage: st2p1, seat: [] }, true )
    const stPerm3: StagePermissionEntity = db.create( 'StagePermission', { id: 'stPerm3', stage: st3p1, seat: [] }, true )
    const stPerm4: StagePermissionEntity = db.create( 'StagePermission', { id: 'stPerm4', stage: st4p1, seat: [] }, true )
    const stPerm5: StagePermissionEntity = db.create( 'StagePermission', { id: 'stPerm5', stage: st5p1, seat: [] }, true )
    const stPerm6: StagePermissionEntity = db.create( 'StagePermission', { id: 'stPerm6', stage: st6p1, seat: [] }, true )
    const stPerm7: StagePermissionEntity = db.create( 'StagePermission', { id: 'stPerm7', stage: st7p1, seat: [] }, true )
    const stPerm8: StagePermissionEntity = db.create( 'StagePermission', { id: 'stPerm8', stage: st8p1, seat: [] }, true )
    const stPerm9: StagePermissionEntity = db.create( 'StagePermission', { id: 'stPerm9', stage: st9p1, seat: [] }, true )
    const stPerm10: StagePermissionEntity = db.create( 'StagePermission', { id: 'stPerm10', stage: st2p2, seat: [] }, true )
    const stPerm11: StagePermissionEntity = db.create( 'StagePermission', { id: 'stPerm11', stage: st3p2, seat: [] }, true )
    const stPerm12: StagePermissionEntity = db.create( 'StagePermission', { id: 'stPerm12', stage: st1p3, seat: [] }, true )
    const stPerm13: StagePermissionEntity = db.create( 'StagePermission', { id: 'stPerm13', stage: st2p3, seat: [] }, true )
    const stPerm14: StagePermissionEntity = db.create( 'StagePermission', { id: 'stPerm14', stage: st3p3, seat: [] }, true )

    // Add Stage Permissions to Seats
    seat1.stagePermissions.push(stPerm1, stPerm2, stPerm3, stPerm4, stPerm5, stPerm6, stPerm7, stPerm8, stPerm9)
    seat2.stagePermissions.push(stPerm5, stPerm6, stPerm7, stPerm8)
    seat3.stagePermissions.push(stPerm9, stPerm10, stPerm11, stPerm12, stPerm13, stPerm14)
    // seat4.stagePermissions.push()

    // SECTIONS
    const section1: SectionEntity = db.create( 'Section', { id: 'section1', name: 'Set Design', sectionPermissions: [], elements: [], elementsOrder: [] }, true )
    const section2: SectionEntity = db.create( 'Section', { id: 'section2', name: 'Location Brief', sectionPermissions: [], elements: [], elementsOrder: [] }, true )
    const section3: SectionEntity = db.create( 'Section', { id: 'section3', name: 'Retouching Instructions', sectionPermissions: [], elements: [], elementsOrder: [] }, true )
    const section4: SectionEntity = db.create( 'Section', { id: 'section4', name: 'Product Details', sectionPermissions: [], elements: [], elementsOrder: [] }, true )
    const section5: SectionEntity = db.create( 'Section', { id: 'section5', name: 'Random Bullshit', sectionPermissions: [], elements: [], elementsOrder: [] }, true )
    const section6: SectionEntity = db.create( 'Section', { id: 'section6', name: 'Dark Magic Spells', sectionPermissions: [], elements: [], elementsOrder: [] }, true )
    const section7: SectionEntity = db.create( 'Section', { id: 'section7', name: 'Important Dates', sectionPermissions: [], elements: [], elementsOrder: [] }, true )
    const section8: SectionEntity = db.create( 'Section', { id: 'section8', name: 'Budget', sectionPermissions: [], elements: [], elementsOrder: [] }, true )
    const section9: SectionEntity = db.create( 'Section', { id: 'section9', name: 'Cake Recipes', sectionPermissions: [], elements: [], elementsOrder: [] }, true )

    // SECTION PERMISSIONS
    const secPerm1: SectionPermissionEntity = db.create( 'SectionPermission', { id: 'secPerm1', section: section1, stage: [] }, true )
    const secPerm2: SectionPermissionEntity = db.create( 'SectionPermission', { id: 'secPerm2', section: section2, stage: [] }, true )
    const secPerm3: SectionPermissionEntity = db.create( 'SectionPermission', { id: 'secPerm3', section: section4, stage: [] }, true )
    const secPerm4: SectionPermissionEntity = db.create( 'SectionPermission', { id: 'secPerm4', section: section1, stage: [] }, true )
    const secPerm5: SectionPermissionEntity = db.create( 'SectionPermission', { id: 'secPerm5', section: section5, stage: [] }, true )
    const secPerm6: SectionPermissionEntity = db.create( 'SectionPermission', { id: 'secPerm6', section: section6, stage: [] }, true )
    const secPerm7: SectionPermissionEntity = db.create( 'SectionPermission', { id: 'secPerm7', section: section3, stage: [] }, true )
    const secPerm8: SectionPermissionEntity = db.create( 'SectionPermission', { id: 'secPerm8', section: section7, stage: [] }, true )
    const secPerm9: SectionPermissionEntity = db.create( 'SectionPermission', { id: 'secPerm9', section: section8, stage: [] }, true )
    const secPermA: SectionPermissionEntity = db.create( 'SectionPermission', { id: 'secPermA', section: section7, stage: [] }, true )
    const secPermB: SectionPermissionEntity = db.create( 'SectionPermission', { id: 'secPermB', section: section9, stage: [] }, true )
    const secPermC: SectionPermissionEntity = db.create( 'SectionPermission', { id: 'secPermC', section: section7, stage: [] }, true )
    const secPermD: SectionPermissionEntity = db.create( 'SectionPermission', { id: 'secPermD', section: section7, stage: [] }, true )

    // Add Section Permissions to Stages
    st1p1.sectionPermissions.push(secPerm1, secPerm2, secPerm3)
    st2p1.sectionPermissions.push(secPerm4, secPerm5, secPerm6)
    st3p1.sectionPermissions.push(secPerm7)
    st1p2.sectionPermissions.push(secPerm8, secPerm9)
    st2p2.sectionPermissions.push(secPermA, secPermB)
    st3p2.sectionPermissions.push(secPermC)
    // st1p3.sectionPermissions.push()
    st2p3.sectionPermissions.push(secPermD)
    // st3p3.sectionPermissions.push()

    // TREE DEFINITION
    const td0: TreeDefinitionEntity = db.create( 'TreeDefinition', { id: 'td0', name: 'Root', instances: [], children: [], project: [project1], parent: [], mediaAllowed: false, collaboratorMode: false }, true )
    const td1: TreeDefinitionEntity = db.create( 'TreeDefinition', { id: 'td1', name: 'Department', instances: [], children: [], project: [project1], parent: [], mediaAllowed: false, collaboratorMode: false }, true )
    const td2: TreeDefinitionEntity = db.create( 'TreeDefinition', { id: 'td2', name: 'Category', instances: [], children: [], project: [project1], parent: [], mediaAllowed: false, collaboratorMode: false }, true )
    const td3: TreeDefinitionEntity = db.create( 'TreeDefinition', { id: 'td3', name: 'Product', instances: [], children: [], project: [project1], parent: [], mediaAllowed: false, collaboratorMode: false }, true )
    const td4: TreeDefinitionEntity = db.create( 'TreeDefinition', { id: 'td4', name: 'View', instances: [], children: [], project: [project1], parent: [], mediaAllowed: true, collaboratorMode: false }, true )

    // Populate Tree Definition Children
    td0.children.push(td1)
    td1.children.push(td2)
    td2.children.push(td3)
    td3.children.push(td4)

    // Add Tree Definitions to projects
    project1.treeDefinitions.push(td0, td1, td2, td3, td4)

    // TREE INSTANCE
    const ti0: TreeInstanceEntity = db.create( 'TreeInstance', { id: 'ti0', name: 'Root', children: [], definition: [], parent: [], media: [], elementData: [] }, true )
    const ti1: TreeInstanceEntity = db.create( 'TreeInstance', { id: 'ti1', name: 'Menswear', children: [], definition: [], parent: [], media: [], elementData: [] }, true )
    const ti2: TreeInstanceEntity = db.create( 'TreeInstance', { id: 'ti2', name: 'Womenswear', children: [], definition: [], parent: [], media: [], elementData: [] }, true )
    const ti3: TreeInstanceEntity = db.create( 'TreeInstance', { id: 'ti3', name: 'Handbags', children: [], definition: [], parent: [], media: [], elementData: [] }, true )
    const ti4: TreeInstanceEntity = db.create( 'TreeInstance', { id: 'ti4', name: 'Dresses', children: [], definition: [], parent: [], media: [], elementData: [] }, true )
    const ti5: TreeInstanceEntity = db.create( 'TreeInstance', { id: 'ti5', name: 'Red Leather Handbag', children: [], definition: [], parent: [], media: [], elementData: [] }, true )
    const ti6: TreeInstanceEntity = db.create( 'TreeInstance', { id: 'ti6', name: 'Snake Leather Handbag', children: [], definition: [], parent: [], media: [], elementData: [] }, true )
    const ti7: TreeInstanceEntity = db.create( 'TreeInstance', { id: 'ti7', name: 'Front', children: [], definition: [], parent: [], media: [], elementData: [] }, true )
    const ti8: TreeInstanceEntity = db.create( 'TreeInstance', { id: 'ti8', name: 'Back', children: [], definition: [], parent: [], media: [], elementData: [] }, true )
    const ti9: TreeInstanceEntity = db.create( 'TreeInstance', { id: 'ti9', name: 'Black Dress', children: [], definition: [], parent: [], media: [], elementData: [] }, true )

    // Add the instances to the Definitions
    td0.instances.push(ti0)
    td1.instances.push(ti1, ti2)
    td2.instances.push(ti3, ti4)
    td3.instances.push(ti5, ti6, ti9)
    td4.instances.push(ti7, ti8)

    // Populate Tree Instance Children
    ti0.children.push(ti1, ti2)
    ti2.children.push(ti3, ti4)
    ti3.children.push(ti5, ti6)
    ti6.children.push(ti7, ti8)
    ti4.children.push(ti9)

    // ELEMENTS
    const e1sect1: ElementEntity = db.create( 'Element', { id: 'e1sect1', name: 'Handbag Sets', isFieldSet: false, treeDefinitionRelevance: undefined, treeInstanceRelevance: [ti3], section: [], elementData: [], fieldDefinitions: [] }, true )
    const e1sect3: ElementEntity = db.create( 'Element', { id: 'e1sect3', name: 'Dresses Sets', isFieldSet: false, treeDefinitionRelevance: undefined, treeInstanceRelevance: [ti4], section: [], elementData: [], fieldDefinitions: [] }, true )
    const e1sect2: ElementEntity = db.create( 'Element', { id: 'e1sect2', name: 'Element 1 of section 2', isFieldSet: false, treeDefinitionRelevance: undefined, treeInstanceRelevance: [], section: [], elementData: [], fieldDefinitions: [] }, true )
    const e1sect4: ElementEntity = db.create( 'Element', { id: 'e1sect4', name: 'Element 1 of section 4', isFieldSet: true, treeDefinitionRelevance: td0, treeInstanceRelevance: [], section: [], elementData: [], fieldDefinitions: [] }, true )

    // Add Elements to sections
    section1.elements.push(e1sect1, e1sect3)
    section2.elements.push(e1sect2)
    section4.elements.push(e1sect4)

    // Assign elements order
    section1.elementsOrder = [e1sect1.id, e1sect3.id]
    section2.elementsOrder = [e1sect2.id]
    section4.elementsOrder = [e1sect4.id]

    // ELEMENT DATA
    // const ed1: ElementDataEntity = db.create( 'ElementData', { id: 'ed1', name: 'Sometthing cool', type: 'EDString', value: 'Lorem ipsum dolor sit amet', elementData: [] }, true )

    // e1sect1.elementData.push(tr1) // Add elementData to elements
    // tr1.data.push(ed1) // Add ElementData to elementData

    // MEDIA ITEMS
    // const med1: MediaItemEntity = db.create( 'MediaItem', { id: 'med1', name: 'm1', treeInstance: [], states: [] }, true )

    // ASSETS
    // const asst1: AssetEntity = db.create( 'Asset', { id: 'asst1', mediaStates: [], assetLocations: [] }, true )

    // MEDIA STATES
    // const medst1: MediaStateEntity = db.create( 'MediaState', { id: 'medst1', mediaItem: [], previousState: [], nextState: undefined, stage: [], asset: asst1 }, true )

    // REPOSITORIES
    const repo1: RepositoryEntity = db.create( 'Repository', { id: 'tempRepo1', name: 'temp', assetLocations: [], seat: seat1, config: '', subscriptions: [] }, true )

    // ASSET LOCATIONS
    // const astloc1: AssetLocationEntity = db.create( 'AssetLocation', { id: 'astloc1', type: 'thingo', asset: asst1, repository: repo1 }, true )

    // SUBSCRIPTIONS
    const sub1: SubscriptionEntity = db.create( 'Subscription', { id: 'sub1', repository: repo1, stage: [] }, true )
    const sub2: SubscriptionEntity = db.create( 'Subscription', { id: 'sub2', repository: repo1, stage: [] }, true )

    // Add subscriptions to the stages
    st1p1.subscriptions.push(sub1)
    st2p1.subscriptions.push(sub2)

    // Add Media states to one another in their correct order
    // Add Media Items to Tree Instances
    // Add Media States to Stages
    // Add Assets etc to repos
    // Add a reverse repo lookup into the stage schema

  })
}
