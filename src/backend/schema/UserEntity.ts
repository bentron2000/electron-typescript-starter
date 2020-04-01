import { Event, ipcRenderer } from 'electron'
import { SeatEntity } from '..'
import { User } from '@models'
import { login } from '@backend'
import { LoginUserObj } from '@models/User'
import { ipcReply } from '@models/ipc'

export class UserEntity {
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
    ipcRenderer.on('try-login', (event: Event, user: LoginUserObj) => {
      UserEntity.loginToRealm(user, (realm, mockDataWasInserted) => {
        // If we logged in successfully, tell the FE AND setup the backend
        // with the new realm instance
        if (realm) {
          readyCallback(realm, mockDataWasInserted)
          ipcReply(event, 'try-login', true)
        } else {
          // Otherwise tell the FE to try again
          ipcReply(event, 'try-login', false)
        }
      })
    })
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
