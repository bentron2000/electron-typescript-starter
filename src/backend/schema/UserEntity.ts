import { IpcRendererEvent, ipcRenderer } from 'electron'

import { User, LoginUserObj } from '@models/User'
import { ipcReply } from '@models/ipc'

import { SeatEntity } from '@backend/schema/SeatEntity'
import { login } from '@backend/login'

export class UserEntity {
  // THIS SCHEMA IS HACKILY REDEFINED IN THE LOGIN FUNCTION BECAUSE THE CLASS IS NOT READY
  // WHEN THE LOGIN FUNCTION IMPORTS IT. FIX THIS
  public static schema: Realm.ObjectSchema = {
    name: 'User',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      // lastTeam: 'string?',
      seats: 'Seat[]',
    },
  }
  public name: string
  public id: string
  // lastTeam?: string
  public seats: SeatEntity[]

  public static toModel(entity: UserEntity): User {
    return {
      id: entity.id,
      model: 'User',
      name: entity.name,
      seats: entity.seats.map(SeatEntity.toModel),
    }
  }

  public static registerListeners(
    readyCallback: (realm: Realm, mockDataWasInserted?: boolean) => void
  ) {
    ipcRenderer.on(
      'try-login',
      (event: IpcRendererEvent, user: LoginUserObj) => {
        UserEntity.loginToRealm(user, (realm, mockDataWasInserted) => {
          // If we logged in successfully, tell the FE AND setup the backend
          // with the new realm instance
          if (realm) {
            readyCallback(realm, mockDataWasInserted)
            ipcReply(event, 'receive-login', true)
          } else {
            // Otherwise tell the FE to try again
            ipcReply(event, 'receive-login', false)
          }
        })
      }
    )
  }

  public static async loginToRealm(
    user: LoginUserObj,
    setterCallback: (realm?: Realm, mockDataWasInserted?: boolean) => void
  ) {
    try {
      const [realm, mockDataWasInserted] = await login(user)
      setterCallback(realm, mockDataWasInserted)
    } catch (_e) {
      console.log('LOGIN ERR', _e)
      setterCallback()
    }
  }

  public static async getById(
    realm: Realm,
    id: string,
    setterCallback: (user: User) => void
  ) {
    const results = ((await realm
      .objects('User')
      .filtered(`id = '${id}'`)) as unknown) as Realm.Results<UserEntity>

    results.addListener((collection, _changes) => {
      // TODO: possible optimisation here using 'changes'
      // console.log('new user dispatched to state')

      console.log('USER GET', id, collection[0])
      setterCallback(UserEntity.toModel(collection[0]))
    })
    return () => results.removeAllListeners() // returns an unsubscribe function
  }
}
