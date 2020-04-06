import { Template } from '@backend/schema/TemplateEntity'

export const emptyProject: Partial<Template> = {
  id: 'blank',
  name: 'Empty Project',
  stages: [
    {
      id: 'template(1000)',
      name: 'Untitled',
      type: 'Blank Stage',
      inputsAllowed: true,
      outputsAllowed: true,
      inputIds: [],
      outputIds: [],
      sectionPermissionIds: [],
      diagramConfig: '{"x":-50,"y":-150}',
    },
  ],
  transitions: [],
  sections: [
    {
      id: 'template(1001)',
      name: 'Untitled Section',
      elementIds: [],
      elementsOrder: [],
    },
  ],
  sectionPermissions: [
    {
      id: 'template(1006)',
      sectionId: 'template(1001)',
      stageId: 'template(1000)',
    },
  ],
  elements: [],
  fieldDefinitions: [],
  treeDefinitions: [
    {
      id: 'template(1002)',
      name: 'Root',
      instanceIds: ['template(1003)'],
      children: [
        {
          id: 'template(1004)',
          name: 'Untitled Tree Definition',
          instanceIds: ['template(1005)'],
          children: [],
          mediaAllowed: false,
          collaboratorMode: false,
          allowedFormats: [],
        },
      ],
      mediaAllowed: false,
      collaboratorMode: false,
      allowedFormats: [],
    },
  ],
  treeInstances: [
    {
      id: 'template(1003)',
      name: 'Root',
      definitionId: 'template(1002)',
      children: [
        {
          id: 'template(1005)',
          name: 'Untitled Tree Instance',
          definitionId: 'template(1004)',
          children: [],
          elementDataIds: [],
        },
      ],
      elementDataIds: [],
    },
  ],
}
