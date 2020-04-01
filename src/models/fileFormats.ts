export interface IFileFormat {
  extension: string
  display: string
  keywords: string[]
}

export interface IAllFileFormats {
  types: IFileFormat[]
  displayList: () => string[]
  extensionList: () => string[]
  keywordList: () => string[]
  typesByKeyword: (keyword: string) => string[]
  extensionsByDisplayName: (name: string) => string[]
}

export const fileFormats: IAllFileFormats = {
  types: [
    { extension: 'jpg', display: 'JPG', keywords: ['Common', 'Web'] },
    { extension: 'jpeg', display: 'JPG', keywords: ['Common', 'Web'] },
    { extension: 'png', display: 'PNG', keywords: ['Common', 'Web'] },
    { extension: 'gif', display: 'GIF', keywords: ['Common', 'Web'] },
    { extension: 'cr2', display: 'CR2', keywords: ['Camera Raw'] },
    { extension: 'nef', display: 'NEF', keywords: ['Camera Raw'] },
    { extension: 'arw', display: 'ARW', keywords: ['Camera Raw'] },
    { extension: 'svg', display: 'SVG', keywords: ['Common', 'Web'] },
    { extension: 'heic', display: 'HEIC', keywords: ['Common'] },
    { extension: 'tif', display: 'TIF', keywords: ['Common'] },
    { extension: 'bmp', display: 'BMP', keywords: ['Common'] },
    { extension: 'tiff', display: 'TIF', keywords: ['Common'] },
    { extension: 'psd', display: 'PSD', keywords: ['Common'] },
  ] as IFileFormat[],
  displayList() {
    return [
      ...new Set(this.types.map((t: IFileFormat) => t.display)),
    ] as string[]
  },
  extensionList() {
    return this.types.map((t: IFileFormat) => t.extension)
  },
  keywordList() {
    return [
      ...new Set(this.types.flatMap((t: IFileFormat) => t.keywords)),
    ] as string[]
  },
  typesByKeyword(keyword: string) {
    return this.types.filter((t: IFileFormat) => t.keywords.includes(keyword))
  },
  extensionsByDisplayName(name: string) {
    return this.types
      .filter((t: IFileFormat) => t.display === name)
      .flatMap((t: IFileFormat) => t.extension)
  },
}
