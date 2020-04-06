import React from 'react'
import { remote } from 'electron'
import { apm } from '@utils/APMProcess/apmWindowListeners'

remote.getGlobal('windowlist')['apm-window'] = remote.getCurrentWebContents().id
console.log(
  'should be the id of the window... ' + remote.getCurrentWebContents().id
)
apm()

export const APMProcessWindow = () => {
  // stuff
  return <p>APM Window!</p>
}
