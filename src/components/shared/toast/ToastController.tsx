import * as React from 'react'
import { IToast } from './ToastProvider'
import { Toast } from './Toast'

class Timer {
  public timerId: number
  public start: number
  public remaining: number
  public callback: () => void
  public paused = false

  constructor(callback: () => void, delay: number) {
    this.timerId = delay
    this.start = delay
    this.remaining = delay
    this.callback = callback

    this.resume()
  }

  public clear() {
    clearTimeout(this.timerId)
  }

  public pause() {
    if (this.paused) {
      return
    }
    this.paused = true
    this.clear()
    this.remaining -= Date.now() - this.start
  }

  public resume() {
    this.paused = false
    this.start = Date.now()
    this.clear()
    this.timerId = setTimeout(this.callback, this.remaining)
  }
}

interface ToastController {
  toast: IToast
  autoDismissTimeout: number
  onDismiss: () => any
}

export const ToastController = ({
  toast: {
    content,
    options: { autoDismiss, pauseOnHover, type },
  },
  autoDismissTimeout,
  onDismiss,
}: ToastController) => {
  const [timeout, setTimeout] = React.useState<Timer>()
  // TODO: use this to create a paused effect at some point
  const [paused, setPaused] = React.useState(timeout ? timeout.paused : false)
  const hasMouseEvents = pauseOnHover && autoDismiss
  const handleMouseEnter = () => {
    if (hasMouseEvents && timeout) {
      timeout.pause()
      setPaused(timeout.paused)
    }
  }
  const handleMouseLeave = () => {
    if (hasMouseEvents && timeout) {
      timeout.resume()
      setPaused(timeout.paused)
    }
  }

  React.useEffect(() => {
    if (autoDismiss && !paused) {
      // Prevent state leaks by resuming on rerender
      timeout
        ? timeout.resume()
        : setTimeout(new Timer(onDismiss, autoDismissTimeout))
    }

    return () => timeout && timeout.pause()
  })

  return (
    <Toast
      onRemove={onDismiss}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      type={type ? type : 'positive'}
    >
      {content}
    </Toast>
  )
}
