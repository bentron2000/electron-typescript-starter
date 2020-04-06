import * as Realm from 'realm'
import { v4 as uuid } from 'uuid'
import { path } from 'ramda'
import { Ctx } from '@models/Ctx'
import { MediaState } from '@models/MediaState'
import { MediaItemEntity } from '@backend/schema/MediaItemEntity'
import { StageEntity } from '@backend/schema/StageEntity'
import { AssetEntity } from '@backend/schema/AssetEntity'

export class MediaStateEntity {
  public static schema: Realm.ObjectSchema = {
    primaryKey: 'id',
    name: 'MediaState',
    properties: {
      id: 'string',
      mediaItem: {
        type: 'linkingObjects',
        objectType: 'MediaItem',
        property: 'states',
      },
      nextState: {
        type: 'linkingObjects',
        objectType: 'MediaState',
        property: 'previousState',
      },
      previousState: 'MediaState?', // are we doing this as a linked list? More consideration required...,
      stage: {
        type: 'linkingObjects',
        objectType: 'Stage',
        property: 'mediaStates',
      },
      asset: 'Asset',
      ancestor: 'MediaState?', // the MS that we replaced on this stage
    },
  }
  public id: string
  public name: string
  public mediaItem: MediaItemEntity
  public nextState?: MediaStateEntity
  public previousState?: MediaStateEntity
  public stage: StageEntity
  public asset: AssetEntity
  public ancestor?: MediaStateEntity

  public static toModel(entity: MediaStateEntity): MediaState {
    return {
      id: entity.id,
      model: 'MediaState',
      name: entity.mediaItem[0].name,
      mediaItemId: entity.mediaItem[0].id,
      nextStateId: path([0, 'id'], entity.nextState),
      previousStateId: path(['id'], entity.previousState),
      stageId: entity.stage[0].id,
      assetId: entity.asset.id,
      ancestorId: path(['id'], entity.ancestor),
      thumbnail: entity.asset.thumbnail,
      preview: entity.asset.preview,
    }
  }

  public static async create(
    realm: Realm,
    ctx: Ctx,
    mediaState: MediaState,
    _args?: any
  ) {
    // Check here that the user has permission to create an asset (in the current user context)
    // these checks have to include checking related entities
    console.log(
      `create media state: dont forget to build out the ctx business...${ctx}`
    ) // this will do something some day...
    realm.write(() => {
      const newMediaStateObj = {
        id: mediaState.id || uuid(),
        mediaItem: [],
        nextState: [],
        stage: [],
        previousState: mediaState.previousStateId
          ? realm
              .objects('MediaState')
              .filtered(`id = '${mediaState.previousStateId}'`)[0]
          : undefined,
        ancestor: mediaState.ancestorId
          ? realm
              .objects('MediaState')
              .filtered(`id = '${mediaState.ancestorId}'`)[0]
          : undefined,
        asset: realm
          .objects('Asset')
          .filtered(`id = '${mediaState.assetId}'`)[0],
      }

      const ms = realm.create<MediaStateEntity>(
        'MediaState',
        newMediaStateObj,
        true
      )

      // Add new ms to stage
      const stage = realm
        .objects<StageEntity>('Stage')
        .filtered(`id = '${mediaState.stageId}'`)[0]
      stage.mediaStates.push(ms)

      // // Add new ms to mediaItem
      const mediaItem = realm
        .objects<MediaItemEntity>('MediaItem')
        .filtered(`id = '${mediaState.mediaItemId}'`)[0]
      mediaItem.states.push(ms)
    })
  }
}
