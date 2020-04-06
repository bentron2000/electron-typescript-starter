import { PendingAsset } from '@models/PendingAsset'
import sharp from 'sharp'

export const thumbGen = {
  // Using Sharp
  jpg: async (asset: PendingAsset) => {
    const data = await sharp(asset.sourcePath)
      .resize(420)
      .jpeg({ quality: 80 })
      .toBuffer()

    return `data:image/jpeg;base64,${data.toString('base64')}`
  },

  // Use ExifTool
  cr2: async (asset: PendingAsset, ep: any) => {
    const data = await ep.readMetadata(asset.sourcePath, ['b', 'PreviewImage'])
    const trimData = data.data[0].PreviewImage.substr(7) // trim leading 'base64:'
    const image = await sharp(Buffer.from(trimData, 'base64'))
      .resize(420)
      .jpeg({ quality: 60 })
      .toBuffer()

    return `data:image/jpeg;base64,${image.toString('base64')}`
  },
  async arw(asset: PendingAsset, ep: any) {
    return this.cr2(asset, ep)
  },
  async nef(asset: PendingAsset, ep: any) {
    const data = await ep.readMetadata(asset.sourcePath, ['b', 'JpgFromRaw'])
    if (!data.error) {
      const trimData = data.data[0].JpgFromRaw.substr(7) // trim leading 'base64:'
      const image = await sharp(Buffer.from(trimData, 'base64'))
        .resize(420)
        .jpeg({ quality: 60 })
        .toBuffer()

      return `data:image/jpeg;base64,${image.toString('base64')}`
    } else {
      console.log('Error in preview generation', data.error)
      return ''
    }
  },

  // Use PSD
  async psd(asset: PendingAsset) {
    return this.jpg(asset)
  },

  // Aliases
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
