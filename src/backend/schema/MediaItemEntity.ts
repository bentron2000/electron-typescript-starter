import { v4 as uuid } from 'uuid'
import { Ctx } from '@models/Ctx'
import { MediaItem } from '@models/MediaItem'
import { TreeInstanceEntity } from '@backend/schema/TreeInstanceEntity'
import { MediaStateEntity } from '@backend/schema/MediaStateEntity'

export class MediaItemEntity {
  public static schema: Realm.ObjectSchema = {
    primaryKey: 'id',
    name: 'MediaItem',
    properties: {
      id: 'string',
      name: 'string',
      treeInstance: {
        type: 'linkingObjects',
        objectType: 'TreeInstance',
        property: 'media',
      },
      states: 'MediaState[]',
    },
  }
  public id: string
  public name: string
  public treeInstance: TreeInstanceEntity
  public states: MediaStateEntity[]

  public static toModel(entity: MediaItemEntity): MediaItem {
    return {
      id: entity.id,
      model: 'MediaItem',
      name: entity.name,
      treeInstanceId: entity.treeInstance[0].id,
      states: entity.states.map(MediaStateEntity.toModel),
    }
  }

  public static async create(
    realm: Realm,
    ctx: Ctx,
    mediaItem: MediaItem,
    _args?: any
  ) {
    // Check here that the user has permission to create MediaItem (in the current user context)
    console.log(
      `create media item: dont forget to build out the ctx business...${ctx}`
    ) // this will do something some day...

    if (mediaItem.treeInstanceId) {
      // Make the new media item
      realm.write(() => {
        const newMI = realm.create<MediaItemEntity>(
          'MediaItem',
          {
            id: mediaItem.id || uuid(),
            name: mediaItem.name,
            treeInstance: [],
            states: [],
          },
          true
        )

        // Find the tree instance
        const ti = (realm
          .objects('TreeInstance')
          .filtered(
            `id = '${mediaItem.treeInstanceId}'`
          )[0] as unknown) as TreeInstanceEntity

        // Add the media item to the tree instance
        ti.media.push(newMI)
      })
    }
  }
}
