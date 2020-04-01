// @ts-nocheck

import Realm from 'realm'
import { fileFormats } from '@components/helpers'
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
  ElementDataEntity,
  StageTransitionEntity,
  RepositoryEntity,
  SubscriptionEntity,
  TemplateEntity,
  // FieldDefinitionEntity
  // MediaItemEntity
  // MediaStateEntity,
  // AssetEntity,
  // AssetLocationEntity,
} from '..'

import { emptyProject } from './emptyProjectTemplate'

export const createMockData = (db: Realm) => {
  // prettier-ignore

  // NB: When hand writing these entries, you'll get errors if you're linking to another
  // entry that has non-optional fields that have not been correctly initialised beforehand.
  // (i.e. ensure the thing you're linking to has already been defined)

  db.write(() => {
    // TEMPLATES
    const template: TemplateEntity = db.create('Template', TemplateEntity.templateToEntity(emptyProject))

    // TEAMS
    const team1: TeamEntity = db.create('Team', { id: 't1', name: 'Sequitur', seats: [], projects: [], owners: [], admins: [] }, true)

    // USERS
    const user1: UserEntity = db.create('User', { id: 'ben', name: 'Ben', seats: [] }, true )
    const user2: UserEntity = db.create('User', { id: 'jules', name: 'Jules', seats: [] }, true )

    // SEATS
    const seat1: SeatEntity = db.create('Seat', { id: 'se1', stagePermissions: [], projectPermissions: [], sectionPermissions: [], user: [], team: [], repositories: [] }, true)
    const seat2: SeatEntity = db.create('Seat', { id: 'se4', stagePermissions: [], projectPermissions: [], sectionPermissions: [], user: [], team: [], repositories: [] }, true)

    // Add seats to teams
    team1.seats.push(seat1, seat2)

    // Add seats to users
    user1.seats.push(seat1)
    user2.seats.push(seat2)

    // Add owners and admins to teams
    team1.owners.push()

    // PROJECTS
    const project1: ProjectEntity = db.create('Project', { id: 'p1', name: 'Hansel & Gretel Summer', stages: [], treeDefinitions: [], team: [], projectPermissions: [], sectionsOrder: ['section5', 'section2', 'section6', 'section4', 'section1', 'section3'] }, true)

    // Add Projects to teams
    team1.projects.push(project1)

    // STAGES
    // eCommerce Project
    const st1p1: StageEntity = db.create('Stage', { id: 'p1st1', name: 'Project Setup', type: 'Brief Stage', sectionPermissions: [], project: [], mediaStates: [], inputsAllowed: true, inputs: [], outputsAllowed: true, outputs: [], diagramConfig: '{"x":100,"y":0}', subscriptions: [] }, true)
    const st2p1: StageEntity = db.create('Stage', { id: 'p1st2', name: 'Shoot', type: 'Shoot Stage', sectionPermissions: [], project: [], mediaStates: [], inputsAllowed: true, inputs: [], outputsAllowed: true, outputs: [], diagramConfig: '{"x":100,"y":200}', subscriptions: [] }, true)
    const st3p1: StageEntity = db.create('Stage', { id: 'p1st3', name: 'Select', type: 'Select Stage', sectionPermissions: [], project: [], mediaStates: [], inputsAllowed: true, inputs: [], outputsAllowed: true, outputs: [], diagramConfig: '{"x":100,"y":400}', subscriptions: [] }, true)
    const st4p1: StageEntity = db.create('Stage', { id: 'p1st4', name: 'Markup', type: 'Markup Stage', sectionPermissions: [], project: [], mediaStates: [], inputsAllowed: true, inputs: [], outputsAllowed: true, outputs: [], diagramConfig: '{"x":500,"y":400}', subscriptions: [] }, true)
    const st5p1: StageEntity = db.create('Stage', { id: 'p1st5', name: 'Archive', type: 'Input Stage', sectionPermissions: [], project: [], mediaStates: [], inputsAllowed: true, inputs: [], outputsAllowed: true, outputs: [], diagramConfig: '{"x":500,"y":200}', subscriptions: [] }, true)
    const st6p1: StageEntity = db.create('Stage', { id: 'p1st6', name: 'Retouch', type: 'Subworkflow Stage', sectionPermissions: [], project: [], mediaStates: [], inputsAllowed: true, inputs: [], outputsAllowed: true, outputs: [], diagramConfig: '{"x":900,"y":400}', subscriptions: [] }, true)
    const st7p1: StageEntity = db.create('Stage', { id: 'p1st7', name: 'Client Review', type: 'Subworkflow Stage', sectionPermissions: [], project: [], mediaStates: [], inputsAllowed: true, inputs: [], outputsAllowed: true, outputs: [], diagramConfig: '{"x":500,"y":600}', subscriptions: [] }, true)
    const st8p1: StageEntity = db.create('Stage', { id: 'p1st8', name: 'QA', type: 'Markup Stage', sectionPermissions: [], project: [], mediaStates: [], inputsAllowed: true, inputs: [], outputsAllowed: true, outputs: [], diagramConfig: '{"x":900,"y":600}', subscriptions: [] }, true)
    const st9p1: StageEntity = db.create('Stage', { id: 'p1st9', name: 'Approved', type: 'Output Stage', sectionPermissions: [], project: [], mediaStates: [], inputsAllowed: true, inputs: [], outputsAllowed: true, outputs: [], diagramConfig: '{"x":100,"y":600}', subscriptions: [] }, true)

    // Add Stages to projects
    project1.stages.push(st1p1, st2p1, st3p1, st4p1, st5p1, st6p1, st7p1, st8p1, st9p1)

    // STAGE TRANSITIONS
    const st1p1_st2p1: StageTransitionEntity = db.create('StageTransition', { id: 'st1p1_st2p1', name: 'Publish Project', sourceStage: [], destinationStage: [] }, true)
    const st2p1_st3p1: StageTransitionEntity = db.create('StageTransition', { id: 'st2p1_st3p1', name: 'Ready for Selection', sourceStage: [], destinationStage: [] }, true)
    const st5p1_st2p1: StageTransitionEntity = db.create('StageTransition', { id: 'st5p1_st2p1', name: 'Reuse Asset', sourceStage: [], destinationStage: [] }, true)
    const st3p1_st4p1: StageTransitionEntity = db.create('StageTransition', { id: 'st3p1_st4p1', name: 'Ready for Markup', sourceStage: [], destinationStage: [] }, true)
    const st4p1_st6p1: StageTransitionEntity = db.create('StageTransition', { id: 'st4p1_st6p1', name: 'Marked Up', sourceStage: [], destinationStage: [] }, true)
    const st6p1_st8p1: StageTransitionEntity = db.create('StageTransition', { id: 'st6p1_st8p1', name: 'Retouch Complete', sourceStage: [], destinationStage: [] }, true)
    const st8p1_st7p1: StageTransitionEntity = db.create('StageTransition', { id: 'st8p1_st7p1', name: 'Approved', sourceStage: [], destinationStage: [] }, true)
    const st7p1_st4p1: StageTransitionEntity = db.create('StageTransition', { id: 'st7p1_st4p1', name: 'Reject Asset', sourceStage: [], destinationStage: [] }, true)
    const st7p1_st9p1: StageTransitionEntity = db.create('StageTransition', { id: 'st7p1_st9p1', name: 'Approve Asset', sourceStage: [], destinationStage: [] }, true)

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
    const pPerm1: ProjectPermissionEntity = db.create('ProjectPermission', { id: 'pPerm1', project: project1, seat: [], admin: true }, true)
    const pPerm3: ProjectPermissionEntity = db.create('ProjectPermission', { id: 'pPerm3', project: project1, seat: [], admin: true }, true)

    // Add Project Permissions to seats
    seat1.projectPermissions.push(pPerm1)
    seat2.projectPermissions.push(pPerm3)

    // STAGE PERMISSIONS
    const stPerm1: StagePermissionEntity = db.create('StagePermission', { id: 'stPerm1', stage: st1p1, seat: [] }, true)
    const stPerm2: StagePermissionEntity = db.create('StagePermission', { id: 'stPerm2', stage: st2p1, seat: [] }, true)
    const stPerm3: StagePermissionEntity = db.create('StagePermission', { id: 'stPerm3', stage: st3p1, seat: [] }, true)
    const stPerm4: StagePermissionEntity = db.create('StagePermission', { id: 'stPerm4', stage: st4p1, seat: [] }, true)
    const stPerm5: StagePermissionEntity = db.create('StagePermission', { id: 'stPerm5', stage: st5p1, seat: [] }, true)
    const stPerm6: StagePermissionEntity = db.create('StagePermission', { id: 'stPerm6', stage: st6p1, seat: [] }, true)
    const stPerm7: StagePermissionEntity = db.create('StagePermission', { id: 'stPerm7', stage: st7p1, seat: [] }, true)
    const stPerm8: StagePermissionEntity = db.create('StagePermission', { id: 'stPerm8', stage: st8p1, seat: [] }, true)
    const stPerm9: StagePermissionEntity = db.create('StagePermission', { id: 'stPerm9', stage: st9p1, seat: [] }, true)

    // Add Stage Permissions to Seats
    seat1.stagePermissions.push(stPerm1, stPerm2, stPerm3, stPerm4, stPerm5, stPerm6, stPerm7, stPerm8, stPerm9)
    seat2.stagePermissions.push(stPerm5, stPerm6, stPerm7, stPerm8)

    // SECTIONS
    const section1: SectionEntity = db.create('Section', { id: 'section1', name: 'Set Design', sectionPermissions: [], elements: [], elementsOrder: [], project: project1 }, true)
    const section2: SectionEntity = db.create('Section', { id: 'section2', name: 'Production Information', sectionPermissions: [], elements: [], elementsOrder: [], project: project1 }, true)
    const section3: SectionEntity = db.create('Section', { id: 'section3', name: 'Retouching Instructions', sectionPermissions: [], elements: [], elementsOrder: [], project: project1 }, true)
    const section4: SectionEntity = db.create('Section', { id: 'section4', name: 'Product Details', sectionPermissions: [], elements: [], elementsOrder: [], project: project1 }, true)
    const section5: SectionEntity = db.create('Section', { id: 'section5', name: 'Random Bullshit', sectionPermissions: [], elements: [], elementsOrder: [], project: project1 }, true)
    const section6: SectionEntity = db.create('Section', { id: 'section6', name: 'Dark Magic Spells', sectionPermissions: [], elements: [], elementsOrder: [], project: project1 }, true)

    // SECTION PERMISSIONS
    const secPerm1: SectionPermissionEntity = db.create('SectionPermission', { id: 'secPerm1', section: section1, stage: [], seat: [] }, true)
    const secPerm2: SectionPermissionEntity = db.create('SectionPermission', { id: 'secPerm2', section: section2, stage: [], seat: [] }, true)
    const secPerm3: SectionPermissionEntity = db.create('SectionPermission', { id: 'secPerm3', section: section4, stage: [], seat: [] }, true)
    const secPerm4: SectionPermissionEntity = db.create('SectionPermission', { id: 'secPerm4', section: section1, stage: [], seat: [] }, true)
    const secPerm5: SectionPermissionEntity = db.create('SectionPermission', { id: 'secPerm5', section: section5, stage: [], seat: [] }, true)
    const secPerm6: SectionPermissionEntity = db.create('SectionPermission', { id: 'secPerm6', section: section6, stage: [], seat: [] }, true)
    const secPerm7: SectionPermissionEntity = db.create('SectionPermission', { id: 'secPerm7', section: section3, stage: [], seat: [] }, true)

    // SEAT SEC PERMS
    const seatSecPerm1: SectionPermissionEntity = db.create('SectionPermission', { id: 'secPerm8', section: section1, stage: [], seat: [] }, true)
    const seatSecPerm2: SectionPermissionEntity = db.create('SectionPermission', { id: 'secPerm9', section: section2, stage: [], seat: [] }, true)
    const seatSecPerm3: SectionPermissionEntity = db.create('SectionPermission', { id: 'secPerm10', section: section4, stage: [], seat: [] }, true)
    const seatSecPerm4: SectionPermissionEntity = db.create('SectionPermission', { id: 'secPerm11', section: section1, stage: [], seat: [] }, true)
    const seatSecPerm5: SectionPermissionEntity = db.create('SectionPermission', { id: 'secPerm12', section: section5, stage: [], seat: [] }, true)
    const seatSecPerm6: SectionPermissionEntity = db.create('SectionPermission', { id: 'secPerm13', section: section6, stage: [], seat: [] }, true)
    const seatSecPerm7: SectionPermissionEntity = db.create('SectionPermission', { id: 'secPerm14', section: section3, stage: [], seat: [] }, true)

    // Add Section Permission to Seats
    seat1.sectionPermissions.push(seatSecPerm1, seatSecPerm2, seatSecPerm3, seatSecPerm4, seatSecPerm5, seatSecPerm6, seatSecPerm7)
    seat2.sectionPermissions.push(seatSecPerm1, seatSecPerm2, seatSecPerm3, seatSecPerm4, seatSecPerm5, seatSecPerm6, seatSecPerm7)

    // Add Section Permissions to Stages
    st1p1.sectionPermissions.push(secPerm1, secPerm2, secPerm3)
    st2p1.sectionPermissions.push(secPerm4, secPerm5, secPerm6)
    st3p1.sectionPermissions.push(secPerm7)

    // TREE DEFINITION
    const def_l0_Root: TreeDefinitionEntity = db.create('TreeDefinition', { id: 'def_l0_Root', name: 'Root', instances: [], children: [], project: [project1], parent: [], mediaAllowed: false, collaboratorMode: false, allowedFormats: fileFormats }, true)
    const def_l1_Department: TreeDefinitionEntity = db.create('TreeDefinition', { id: 'def_l1_Department', name: 'Department', instances: [], children: [], project: [project1], parent: [], mediaAllowed: false, collaboratorMode: false, allowedFormats: fileFormats }, true)
    const def_l2_Category: TreeDefinitionEntity = db.create('TreeDefinition', { id: 'def_l2_Category', name: 'Category', instances: [], children: [], project: [project1], parent: [], mediaAllowed: false, collaboratorMode: false, allowedFormats: fileFormats }, true)
    const def_l3_Product: TreeDefinitionEntity = db.create('TreeDefinition', { id: 'def_l3_Product', name: 'Product', instances: [], children: [], project: [project1], parent: [], mediaAllowed: false, collaboratorMode: false, allowedFormats: fileFormats }, true)
    const def_l4_View: TreeDefinitionEntity = db.create('TreeDefinition', { id: 'def_l4_View', name: 'View', instances: [], children: [], project: [project1], parent: [], mediaAllowed: true, collaboratorMode: true, allowedFormats: fileFormats }, true)

    // Populate Tree Definition Children
    def_l0_Root.children.push(def_l1_Department)
    def_l1_Department.children.push(def_l2_Category)
    def_l2_Category.children.push(def_l3_Product)
    def_l3_Product.children.push(def_l4_View)

    // Add Tree Definitions to projects
    project1.treeDefinitions.push(def_l0_Root, def_l1_Department, def_l2_Category, def_l3_Product, def_l4_View)

    // TREE INSTANCE

    // Root
    const l0_Root: TreeInstanceEntity = db.create('TreeInstance', { id: 'l0_Root', name: 'Root', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)

    // L1 (Department)
    const l1_Womenswear: TreeInstanceEntity = db.create('TreeInstance', { id: 'l1_Womenswear', name: 'Womenswear', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l1_Menswear: TreeInstanceEntity = db.create('TreeInstance', { id: 'l1_Menswear', name: 'Menswear', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)

    // L2 (Category)
    const l2_Accessories: TreeInstanceEntity = db.create('TreeInstance', { id: 'l2_Accessories', name: 'Accessories', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l2_Clutches: TreeInstanceEntity = db.create('TreeInstance', { id: 'l2_Clutches', name: 'Clutches', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l2_CrossBodyBags: TreeInstanceEntity = db.create('TreeInstance', { id: 'l2_CrossBodyBags', name: 'Cross Body Bags', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l2_Hobos: TreeInstanceEntity = db.create('TreeInstance', { id: 'l2_Hobos', name: 'Hobos', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l2_MiniClutches: TreeInstanceEntity = db.create('TreeInstance', { id: 'l2_MiniClutches', name: 'Mini Clutches', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l2_Pouches: TreeInstanceEntity = db.create('TreeInstance', { id: 'l2_Pouches', name: 'Pouches', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)

    // L3 (Product)
    const l3_BlackClutch: TreeInstanceEntity = db.create('TreeInstance', { id: 'l3_BlackClutch', name: 'Black Clutch', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l3_BlackMiniClutch: TreeInstanceEntity = db.create('TreeInstance', { id: 'l3_BlackMiniClutch', name: 'Black Mini Clutch', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l3_BlackPouch: TreeInstanceEntity = db.create('TreeInstance', { id: 'l3_BlackPouch', name: 'Black Pouch', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l3_BlackSeashellStrap: TreeInstanceEntity = db.create('TreeInstance', { id: 'l3_BlackSeashellStrap', name: 'Black Seashell Strap', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l3_BlackWovenHobo: TreeInstanceEntity = db.create('TreeInstance', { id: 'l3_BlackWovenHobo', name: 'Black Woven Hobo', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l3_BlackWovenPouch: TreeInstanceEntity = db.create('TreeInstance', { id: 'l3_BlackWovenPouch', name: 'Black Woven Pouch', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l3_HawaiianClutch: TreeInstanceEntity = db.create('TreeInstance', { id: 'l3_HawaiianClutch', name: 'Hawaiian Clutch', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l3_HawaiianMiniClutch: TreeInstanceEntity = db.create('TreeInstance', { id: 'l3_HawaiianMiniClutch', name: 'Hawaiian Mini Clutch', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l3_LeopardClutch: TreeInstanceEntity = db.create('TreeInstance', { id: 'l3_LeopardClutch', name: 'Leopard Clutch', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l3_LeopardMiniClutch: TreeInstanceEntity = db.create('TreeInstance', { id: 'l3_LeopardMiniClutch', name: 'Leopard Mini Clutch', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l3_LeopardPouch: TreeInstanceEntity = db.create('TreeInstance', { id: 'l3_LeopardPouch', name: 'Leopard Pouch', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l3_NaturalSeashellStrap: TreeInstanceEntity = db.create('TreeInstance', { id: 'l3_NaturalSeashellStrap', name: 'Natural Seashell Strap', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l3_RedBlackClutch: TreeInstanceEntity = db.create('TreeInstance', { id: 'l3_RedBlackClutch', name: 'Red & Black Clutch', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l3_RedBlackMiniClutch: TreeInstanceEntity = db.create('TreeInstance', { id: 'l3_RedBlackMiniClutch', name: 'Red & Black Mini Clutch', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l3_RedCheckClutch: TreeInstanceEntity = db.create('TreeInstance', { id: 'l3_RedCheckClutch', name: 'Red Check Clutch', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l3_RedCheckMiniClutch: TreeInstanceEntity = db.create('TreeInstance', { id: 'l3_RedCheckMiniClutch', name: 'Red Check Mini Clutch', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l3_StayWildCrossBodyBag: TreeInstanceEntity = db.create('TreeInstance', { id: 'l3_StayWildCrossBodyBag', name: 'Stay Wild Cross Body Bag', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l3_TanWovenHobo: TreeInstanceEntity = db.create('TreeInstance', { id: 'l3_TanWovenHobo', name: 'Tan Woven Hobo', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l3_TanWovenPouch: TreeInstanceEntity = db.create('TreeInstance', { id: 'l3_TanWovenPouch', name: 'Tan Woven Pouch', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l3_Tassels: TreeInstanceEntity = db.create('TreeInstance', { id: 'l3_Tassels', name: 'Tassels', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)

    // L4 (View)
    const l4_Front_BlackClutch: TreeInstanceEntity = db.create('TreeInstance', { id: 'l4_Front_BlackClutch', name: 'Front', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l4_Front_BlackMiniClutch: TreeInstanceEntity = db.create('TreeInstance', { id: 'l4_Front_BlackMiniClutch', name: 'Front', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l4_Front_BlackPouch: TreeInstanceEntity = db.create('TreeInstance', { id: 'l4_Front_BlackPouch', name: 'Front', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l4_Front_BlackSeashellStrap: TreeInstanceEntity = db.create('TreeInstance', { id: 'l4_Front_BlackSeashellStrap', name: 'Front', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l4_Front_BlackWovenHobo: TreeInstanceEntity = db.create('TreeInstance', { id: 'l4_Front_BlackWovenHobo', name: 'Front', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l4_Front_BlackWovenPouch: TreeInstanceEntity = db.create('TreeInstance', { id: 'l4_Front_BlackWovenPouch', name: 'Front', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l4_Front_HawaiianClutch: TreeInstanceEntity = db.create('TreeInstance', { id: 'l4_Front_HawaiianClutch', name: 'Front', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l4_Front_HawaiianMiniClutch: TreeInstanceEntity = db.create('TreeInstance', { id: 'l4_Front_HawaiianMiniClutch', name: 'Front', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l4_Front_LeopardClutch: TreeInstanceEntity = db.create('TreeInstance', { id: 'l4_Front_LeopardClutch', name: 'Front', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l4_Front_LeopardMiniClutch: TreeInstanceEntity = db.create('TreeInstance', { id: 'l4_Front_LeopardMiniClutch', name: 'Front', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l4_Front_LeopardPouch: TreeInstanceEntity = db.create('TreeInstance', { id: 'l4_Front_LeopardPouch', name: 'Front', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l4_Front_NaturalSeashellStrap: TreeInstanceEntity = db.create('TreeInstance', { id: 'l4_Front_NaturalSeashellStrap', name: 'Front', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l4_Front_RedBlackClutch: TreeInstanceEntity = db.create('TreeInstance', { id: 'l4_Front_RedBlackClutch', name: 'Front', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l4_Front_RedBlackMiniClutch: TreeInstanceEntity = db.create('TreeInstance', { id: 'l4_Front_RedBlackMiniClutch', name: 'Front', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l4_Front_RedCheckClutch: TreeInstanceEntity = db.create('TreeInstance', { id: 'l4_Front_RedCheckClutch', name: 'Front', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l4_Front_RedCheckMiniClutch: TreeInstanceEntity = db.create('TreeInstance', { id: 'l4_Front_RedCheckMiniClutch', name: 'Front', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l4_Front_StayWildCrossBodyBag: TreeInstanceEntity = db.create('TreeInstance', { id: 'l4_Front_StayWildCrossBodyBag', name: 'Front', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l4_Front_TanWovenHobo: TreeInstanceEntity = db.create('TreeInstance', { id: 'l4_Front_TanWovenHobo', name: 'Front', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l4_Front_TanWovenPouch: TreeInstanceEntity = db.create('TreeInstance', { id: 'l4_Front_TanWovenPouch', name: 'Front', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)
    const l4_Front_Tassels: TreeInstanceEntity = db.create('TreeInstance', { id: 'l4_Front_Tassels', name: 'Front', children: [], definition: [], parent: [], media: [], elementData: [], elements: [] }, true)

    // Add the instances to the Definitions
    def_l0_Root.instances.push(l0_Root)
    def_l1_Department.instances.push(l1_Womenswear, l1_Menswear)
    def_l2_Category.instances.push(l2_Accessories, l2_Clutches, l2_CrossBodyBags, l2_Hobos, l2_MiniClutches, l2_Pouches)
    def_l3_Product.instances.push(l3_BlackClutch, l3_BlackMiniClutch, l3_BlackPouch, l3_BlackSeashellStrap, l3_BlackWovenHobo, l3_BlackWovenPouch, l3_HawaiianClutch, l3_HawaiianMiniClutch, l3_LeopardClutch, l3_LeopardMiniClutch, l3_LeopardPouch, l3_NaturalSeashellStrap, l3_RedBlackClutch, l3_RedBlackMiniClutch, l3_RedCheckClutch, l3_RedCheckMiniClutch, l3_StayWildCrossBodyBag, l3_TanWovenHobo, l3_TanWovenPouch, l3_Tassels)
    def_l4_View.instances.push(l4_Front_BlackClutch, l4_Front_BlackMiniClutch, l4_Front_BlackPouch, l4_Front_BlackSeashellStrap, l4_Front_BlackWovenHobo, l4_Front_BlackWovenPouch, l4_Front_HawaiianClutch, l4_Front_HawaiianMiniClutch, l4_Front_LeopardClutch, l4_Front_LeopardMiniClutch, l4_Front_LeopardPouch, l4_Front_NaturalSeashellStrap, l4_Front_RedBlackClutch, l4_Front_RedBlackMiniClutch, l4_Front_RedCheckClutch, l4_Front_RedCheckMiniClutch, l4_Front_StayWildCrossBodyBag, l4_Front_TanWovenHobo, l4_Front_TanWovenPouch, l4_Front_Tassels)

    // Populate Tree Instance Children
    l0_Root.children.push(l1_Womenswear, l1_Menswear)

    l1_Womenswear.children.push(l2_Accessories, l2_Clutches, l2_CrossBodyBags, l2_Hobos, l2_MiniClutches, l2_Pouches)

    l2_Accessories.children.push(l3_Tassels)
    l2_Clutches.children.push(l3_BlackClutch, l3_BlackSeashellStrap, l3_HawaiianClutch, l3_LeopardClutch, l3_NaturalSeashellStrap, l3_RedBlackClutch, l3_RedCheckClutch)
    l2_CrossBodyBags.children.push(l3_StayWildCrossBodyBag)
    l2_Hobos.children.push(l3_TanWovenHobo, l3_BlackWovenHobo)
    l2_MiniClutches.children.push(l3_BlackMiniClutch, l3_HawaiianMiniClutch, l3_LeopardMiniClutch, l3_RedBlackMiniClutch, l3_RedCheckMiniClutch)
    l2_Pouches.children.push(l3_BlackPouch, l3_BlackWovenPouch, l3_LeopardPouch, l3_TanWovenPouch)

    l3_BlackClutch.children.push(l4_Front_BlackClutch)
    l3_BlackMiniClutch.children.push(l4_Front_BlackMiniClutch)
    l3_BlackPouch.children.push(l4_Front_BlackPouch)
    l3_BlackSeashellStrap.children.push(l4_Front_BlackSeashellStrap)
    l3_BlackWovenHobo.children.push(l4_Front_BlackWovenHobo)
    l3_BlackWovenPouch.children.push(l4_Front_BlackWovenPouch)
    l3_HawaiianClutch.children.push(l4_Front_HawaiianClutch)
    l3_HawaiianMiniClutch.children.push(l4_Front_HawaiianMiniClutch)
    l3_LeopardClutch.children.push(l4_Front_LeopardClutch)
    l3_LeopardMiniClutch.children.push(l4_Front_LeopardMiniClutch)
    l3_LeopardPouch.children.push(l4_Front_LeopardPouch)
    l3_NaturalSeashellStrap.children.push(l4_Front_NaturalSeashellStrap)
    l3_RedBlackClutch.children.push(l4_Front_RedBlackClutch)
    l3_RedBlackMiniClutch.children.push(l4_Front_RedBlackMiniClutch)
    l3_RedCheckClutch.children.push(l4_Front_RedCheckClutch)
    l3_RedCheckMiniClutch.children.push(l4_Front_RedCheckMiniClutch)
    l3_StayWildCrossBodyBag.children.push(l4_Front_StayWildCrossBodyBag)
    l3_TanWovenHobo.children.push(l4_Front_TanWovenHobo)
    l3_TanWovenPouch.children.push(l4_Front_TanWovenPouch)
    l3_Tassels.children.push(l4_Front_Tassels)

    // ELEMENTS
    const e1sect1: ElementEntity = db.create('Element', { id: 'e1sect1', name: 'Womenswear Sets', isFieldSet: false, treeDefinitionRelevance: undefined, treeInstanceRelevance: [l1_Womenswear], section: [], elementData: [], fieldDefinitions: [] }, true)
    const e1sect3: ElementEntity = db.create('Element', { id: 'e1sect3', name: 'Menswear Sets', isFieldSet: false, treeDefinitionRelevance: undefined, treeInstanceRelevance: [l1_Menswear], section: [], elementData: [], fieldDefinitions: [] }, true)
    const e1sect2: ElementEntity = db.create('Element', { id: 'e1sect2', name: 'Call Sheet', isFieldSet: false, treeDefinitionRelevance: undefined, treeInstanceRelevance: [...l0_Root.children], section: [], elementData: [], fieldDefinitions: [] }, true)
    const e1sect4: ElementEntity = db.create('Element', { id: 'e1sect4', name: 'Merchandising Fields', isFieldSet: true, treeDefinitionRelevance: def_l3_Product, nestedTreeDefinitionRelevance: def_l0_Root, treeInstanceRelevance: def_l0_Root.instances, section: [], elementData: [], fieldDefinitions: [] }, true)

    // Add Elements to sections
    section1.elements.push(e1sect1, e1sect3)
    section2.elements.push(e1sect2)
    section4.elements.push(e1sect4)

    // Assign elements order
    section1.elementsOrder = [e1sect1.id, e1sect3.id]
    section2.elementsOrder = [e1sect2.id]
    section4.elementsOrder = [e1sect4.id]

    // Field Definitions
    // const colourField: FieldDefinitionEntity = db.create('FieldDefinition', { id: 'colourField', name: 'Colour', element: [], type: 'string', instances: []})
    // const skuField: FieldDefinitionEntity = db.create('FieldDefinition', { id: 'skuField', name: 'SKU', element: [], type: 'string', instances: []})

    // ELEMENT DATA
    const createElementData = (element: ElementEntity, td: TreeDefinitionEntity) => {
      td.instances.map(ti => {
        const edObj = db.create('ElementData', new ElementDataEntity({ name: ti.name }))
        ti.elementData.push(edObj)
        element.elementData.push(edObj)
      })
    }

    createElementData(e1sect4, def_l3_Product)

    // MEDIA ITEMS
    // const med1: MediaItemEntity = db.create( 'MediaItem', { id: 'med1', name: 'm1', treeInstance: [], states: [] }, true )

    // ASSETS
    // const asst1: AssetEntity = db.create( 'Asset', { id: 'asst1', mediaStates: [], assetLocations: [] }, true )

    // MEDIA STATES
    // const medst1: MediaStateEntity = db.create( 'MediaState', { id: 'medst1', mediaItem: [], previousState: [], nextState: undefined, stage: [], asset: asst1 }, true )

    // REPOSITORIES
    const repo1: RepositoryEntity = db.create('Repository', { id: 'tempRepo1', name: 'temp', assetLocations: [], seat: seat1, config: '', subscriptions: [] }, true)

    // ASSET LOCATIONS
    // const astloc1: AssetLocationEntity = db.create( 'AssetLocation', { id: 'astloc1', type: 'thingo', asset: asst1, repository: repo1 }, true )

    // SUBSCRIPTIONS
    const sub1: SubscriptionEntity = db.create('Subscription', { id: 'sub1', repository: repo1, stage: [] }, true)
    const sub2: SubscriptionEntity = db.create('Subscription', { id: 'sub2', repository: repo1, stage: [] }, true)

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
