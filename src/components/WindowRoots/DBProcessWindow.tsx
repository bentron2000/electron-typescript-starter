import React from 'react'
import { dbProcess } from '@utils/DBProcess/dbListeners'
import { remote } from 'electron'

remote.getGlobal('windowlist')['db-window'] = remote.getCurrentWebContents().id
dbProcess()

export const DBProcessWindow = () => {
  return <p>DB Window!</p>
}
