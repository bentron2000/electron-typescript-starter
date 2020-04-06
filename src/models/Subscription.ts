import { Stage } from '@models/Stage'
import { Repository } from '@models/Repository'
import { SetRequired } from '@helpers/typeScriptHelpers'

export interface Subscription {
  readonly id: string
  readonly model: string
  repository: Repository
  stage: Stage
}

export function buildSubscription(
  s: SetRequired<Partial<Subscription>, 'repository' | 'stage'>
): Subscription {
  return {
    id: '',
    model: 'Subscription',
    ...s,
  }
}
