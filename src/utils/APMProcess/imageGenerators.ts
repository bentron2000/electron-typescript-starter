import { PendingAsset } from '@models/PendingAsset'
import sharp from 'sharp'

type ETImageMetadataTag = 'PreviewImage' | 'JpgFromRaw'
interface IETImagePreviewOptions {
  size: number
  jpgQuality: number
}

const rewriteImageToBase64String = async (
  data: string | Buffer,
  options: IETImagePreviewOptions
) => {
  const image = await sharp(data)
    .resize(options.size)
    .jpeg({ quality: options.jpgQuality })
    .toBuffer()
  return `data:image/jpeg;base64,${image.toString('base64')}`
}

const extractPreviewData = async (
  exiftool: any,
  path: string,
  tagname: ETImageMetadataTag
) => {
  const data = await exiftool.readMetadata(path, ['b', tagname])
  if (!data.Error && data.data[0]) {
    return data.data[0].substr(7) // trim leading 'base64:'
  } else {
    console.log('Error in preview generation', data.Error)
    return ''
  }
}

const imageGen = (options: IETImagePreviewOptions) => {
  const mergedOptions = { jpgQuality: 60, size: 420, ...options }
  return {
    // Using Sharp
    jpg: async (asset: PendingAsset) => {
      return rewriteImageToBase64String(asset.sourcePath, mergedOptions)
    },
    // Use ExifTool
    cr2: async (asset: PendingAsset, ep: any) => {
      const imageData = await extractPreviewData(
        ep,
        asset.sourcePath,
        'PreviewImage'
      )
      const dataAsBuffer = Buffer.from(imageData, 'base64')
      return rewriteImageToBase64String(dataAsBuffer, mergedOptions)
    },
    async nef(asset: PendingAsset, ep: any) {
      const imageData = await extractPreviewData(
        ep,
        asset.sourcePath,
        'JpgFromRaw'
      )
      const dataAsBuffer = Buffer.from(imageData, 'base64')
      return rewriteImageToBase64String(dataAsBuffer, mergedOptions)
    },

    // Aliases
    async arw(asset: PendingAsset, ep: any) {
      return this.cr2(asset, ep)
    },
    async psd(asset: PendingAsset) {
      return this.jpg(asset)
    },
    async tiff(asset: PendingAsset) {
      return this.jpg(asset)
    },
    async png(asset: PendingAsset) {
      return this.jpg(asset)
    },
    async gif(asset: PendingAsset) {
      return this.jpg(asset)
    },
    async svg(asset: PendingAsset) {
      return this.jpg(asset)
    },
    async heic(asset: PendingAsset) {
      return this.jpg(asset)
    },
    async tif(asset: PendingAsset) {
      return this.jpg(asset)
    },
  }
}

export const thumbGen = imageGen({ jpgQuality: 60, size: 420 })
export const previewGen = imageGen({ jpgQuality: 80, size: 1500 })
