import { Repository, Stage } from '.'
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
    ...s
  }
}
