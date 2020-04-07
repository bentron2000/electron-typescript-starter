import React, { Component } from 'react'
import { remote } from 'electron'
import { dbProcess } from '@utils/DBProcess/dbListeners'

remote.getGlobal('windowlist')['db-window'] = remote.getCurrentWebContents().id

dbProcess()

export class DBProcessWindow extends Component {
  public render() {
    return <p>DB Window</p>
  }
}
