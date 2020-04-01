import { theme } from '../components/shared/Theme/theme'

export interface StageType {
  keywords: string[]
  color: string
  icon: string
}

const types = {
  brief: {
    keywords: ['brief', 'project', 'planning', 'setup'],
    color: theme.purple,
    icon: 'Brief Stage'
  },
  shoot: {
    keywords: ['shoot', 'photography', 'assets'],
    color: theme.primary,
    icon: 'Shoot Stage'
  },
  select: {
    keywords: ['select', 'pick', 'choose', 'selects'],
    color: theme.blue,
    icon: 'Select Stage'
  },
  markup: {
    keywords: ['markup', 'review', 'director', 'qa'],
    color: theme.blue,
    icon: 'Markup Stage'
  },
  subworkflow: {
    keywords: ['subworkflow', 'retouch', 'client'],
    color: theme.green,
    icon: 'Subworkflow Stage'
  },
  input: {
    keywords: ['input', 'import', 'embed', 'archive'],
    color: theme.orange,
    icon: 'Input Stage'
  },
  output: {
    keywords: ['output', 'approved', 'approve', 'social'],
    color: theme.red,
    icon: 'Output Stage'
  },
  blank: {
    keywords: [],
    color: theme.blue,
    icon: 'Blank Stage'
  }
}

export const typePicker = (typeName: string): StageType => {
  const name = typeName.toLowerCase().split(' ')
  const type = Object.keys(types).find(key => types[key].keywords.some((t: string) => name.includes(t)))
  return type ? types[type] : types.blank
}
