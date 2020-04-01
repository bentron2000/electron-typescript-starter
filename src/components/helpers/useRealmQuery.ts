import * as React from 'react'
import { useToasts } from '@components/shared'
import {
  LoupeRealmResponse,
  LoupeRealmErrorResponse,
  responseToTuple,
} from '@models/ipc'

// Modelled from apollo-hooks `useMutation` to simplify / DRY up component interactions with Realm
// query methods.
// --
// TODO: allow multiple args (having troubles typing this, but not super important for realm use case
// as all our thunks are designed to  take only one params argument)
export const useRealmQuery = <T, A = T>(
  realmQueryMethod: (arg: A) => Promise<LoupeRealmResponse>
): [
  (
    arg: A
  ) => Promise<{ error: LoupeRealmErrorResponse | null; data: T | null }>,
  { loading: boolean; error: LoupeRealmErrorResponse | null; data: T | null }
] => {
  const { addToast } = useToasts()
  const [data, setData] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<LoupeRealmErrorResponse | null>(null)

  const fetch = async (arg: A) => {
    setLoading(true)
    const [errorRes, dataRes] = await responseToTuple<T>(realmQueryMethod(arg))
    setTimeout(() => setLoading(false))
    setData(dataRes)
    if (errorRes) {
      addToast(errorRes.message, { type: 'negative' })
      setError(errorRes)
    }
    return Promise.resolve({ data: dataRes, error: errorRes })
  }

  return [fetch, { loading, error, data }]
}
