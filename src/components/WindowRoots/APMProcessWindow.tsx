import React, { Component } from 'react'
import { remote } from 'electron'
import { apm } from '@utils/APMProcess/apmWindowListeners'

remote.getGlobal('windowlist')['apm-window'] = remote.getCurrentWebContents().id

apm()

export class APMProcessWindow extends Component {
  public render() {
    return <p>APM Window</p>
  }
}
