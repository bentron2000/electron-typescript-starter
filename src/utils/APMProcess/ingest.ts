import * as path from 'path'
import * as fileType from 'file-type'
// @ts-ignore // no types for node-exiftool
import * as exiftool from 'node-exiftool'
// @ts-ignore // no types for dist-exiftool
import * as exiftoolBin from 'dist-exiftool'

import { PendingAsset, buildPendingAsset } from '@models/PendingAsset'
import { Stage } from '@models/Stage'
import { Repository } from '@models/Repository'
import { LoupeRealmResponse, renderSuccess, renderError } from '@models/ipc'

import { v4 as uuid } from 'uuid'
import { thumbGen, previewGen } from '@utils/APMProcess/imageGenerators'
import { ipcRenderer } from 'electron'
import { generateHash } from '@utils/Helpers/fsHelpers'

// Some fuckery required to get exiftool to run in dev vs packaged app.
// Note that exiftool is manually exported into the package and differentated by platform
// https://stackoverflow.com/questions/56242705/exiftool-vendored-doesnt-return-when-used-in-an-electron-app-on-mac
const isDevelopment = process.env.NODE_ENV === 'development'

const exiftoolFolderAndFile =
  process.platform === 'win32'
    ? 'resources/exiftool/exiftoolwin/exiftool.exe'
    : 'resources/exiftool/exiftool/exiftool'

const exiftoolPath = isDevelopment
  ? exiftoolBin
  : path.resolve(__dirname, '../..', exiftoolFolderAndFile)

// const DEFAULT_REPO_LOCATION = `${__dirname}/../../../../repos`

/*
 Copy the file into the managed local repo folder
 */
// const copyToTemp = async (asset: PendingAsset, repoId: string) => {
//   await mkDir(DEFAULT_REPO_LOCATION)
//   await mkDir(`${DEFAULT_REPO_LOCATION}/${repoId}`)

//   const newFilePath = `${DEFAULT_REPO_LOCATION}/${repoId}/asset_${asset.id}.loupefile`
//   await copyFile(asset.sourcePath, newFilePath)
//   asset.sourcePath = newFilePath

//   return asset
// }

/**
 * Add a hash to a PendingAsset
 */
const addHash = async (asset: PendingAsset) => {
  asset.hash = await generateHash(asset.sourcePath)
  return asset
}

/**
 * Generate a thumbnail for a PendingAsset
 */
const generateThumbnail = async (asset: PendingAsset, ep: any) => {
  try {
    asset.thumbnail = await thumbGen[asset.format.ext](asset, ep)
    return asset
  } catch (err) {
    console.error(err)
    asset.thumbnail = ''
    return asset
    // Depending if we want an error or an icon...
    // throw `${asset.fileName}: Could not generate thumbnail.`
  }
}

/**
 * Generate a preview for a PendingAsset
 */
const generatePreview = async (asset: PendingAsset, ep: any) => {
  try {
    asset.preview = await previewGen[asset.format.ext](asset, ep)
    return asset
  } catch (err) {
    console.error(err)
    asset.preview = ''
    return asset
    // Depending if we want an error or an icon...
    // throw `${asset.fileName}: Could not generate preview.`
  }
}

/**
 * Identify an asset  - i.e. Correctly popuate the format property
 */
const identify = (pa: PendingAsset): Promise<PendingAsset> => {
  return new Promise((resolve, reject) => {
    const updatePA = async () => {
      const fileTypeResult = await fileType.fromFile(pa.sourcePath)
      if (fileTypeResult) {
        pa.format = fileTypeResult
        resolve(pa)
      } else {
        resolve(pa)
      }
    }

    updatePA()
  })
}

/**
 * Extract metadata from asset
 */
const extractMetadata = async (asset: PendingAsset, ep: any) => {
  try {
    const meta = await ep.readMetadata(asset.sourcePath, ['j']) // j flag outputs to json
    asset.metadata = meta.data
    return asset
  } catch (err) {
    console.error(err)
    throw new Error(`${asset.fileName}: Could not extract metadata.`)
  }
}

/**
 * Create the model objects for the asset and its location
 */
const createPendingAssetFromPath = async (
  sourcePath: string,
  stageId: string
) => {
  const pa = buildPendingAsset({
    id: uuid(),
    sourcePath,
    fileName: path.basename(sourcePath),
    stageId,
    hash: '',
    metadata: {},
    thumbnail: '',
  })
  return pa
}

const sendInfoBackFunc = (windowid: number) => (res: PendingAsset) => {
  ipcRenderer.sendTo(windowid, 'upsert-pending-asset', res)
  return res
}

export const ingestAssets = (
  fileName: string,
  stage: Stage,
  repo: Repository,
  dbWindowId: number
) => {
  return new Promise<LoupeRealmResponse>((resolve, reject) => {
    const sendInfoBack = sendInfoBackFunc(dbWindowId)

    const ep = new exiftool.ExiftoolProcess(exiftoolPath)
    ep.open().then(() => {
      createPendingAssetFromPath(fileName, stage.id)
        .then(res => sendInfoBack(res))
        // .then(res => copyToTemp(res, repo.id)) // This should actually only copy to temp... this is the fucky
        .then(res => addHash(res))
        .then(res => identify(res))
        .then(res => extractMetadata(res, ep))
        .then(res => generateThumbnail(res, ep))
        // .then(res => sendInfoBack(res)) // fewer returns for perf reasons :/
        .then(res => generatePreview(res, ep))
        .then(res => sendInfoBack(res))
        .then(res => {
          ep.close()
          resolve(renderSuccess(res))
        })
        .catch(err => {
          console.error(err)
          ep.close()
          reject(renderError(err, 'Import Failed! (1)'))
        })
    })
  })
}
