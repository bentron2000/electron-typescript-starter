import * as fs from 'fs'
import * as crypto from 'crypto'

/**
 * Create a folder if it doesn't exist - recursively create dirs
 */
export const mkDir = async (path: string) =>
  new Promise((resolve, reject) => {
    fs.stat(path, (_err, stats) => {
      if (!stats) {
        fs.mkdir(path, err => {
          if (err) {
            console.log(`mkDir: ${path}`)
            reject(err)
          }
          resolve()
        })
      }
      resolve()
    })
  })

/**
 * Copy a file from a source to a destination
 */
export const copyFile = async (sourcePath: string, destPath: string) =>
  new Promise((resolve, reject) => {
    fs.copyFile(sourcePath, destPath, err => {
      if (err) {
        console.log(`Copy Error: ${sourcePath} to ${destPath}`)
        reject(err)
      }
      resolve()
    })
  })

/**
 * Delete a file
 */
export const deleteFile = async (file: string) =>
  new Promise((resolve, reject) => {
    fs.unlink(file, err => {
      if (err) {
        console.log(`Error deleting ${file}`)
        reject(err)
      }
      resolve()
    })
  })

/**
 * Generate a checksum from a file
 */
export const generateHash = (pathToFile: string): Promise<string> => {
  return new Promise(resolve => {
    const hash = crypto.createHash('sha256')
    const input = fs.createReadStream(pathToFile)
    input.on('readable', () => {
      const data = input.read()
      if (data) {
        hash.update(data)
      } else {
        resolve(hash.digest('hex'))
      }
    })
  })
}
