import * as React from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'
import { ToastController } from './ToastController'

const ToastContainer = styled.div`
  position: absolute;
  box-sizing: border-box;
  max-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  top: 0;
  right: 0;
  z-index: 1000;
`

interface ToastProvider {
  children?: any
  portalToRef?: React.RefObject<any>
  autoDismissTimeout?: number
}

export type validIToastOptsTypes = 'positive' | 'negative' | 'informative'

export interface IToast {
  id: string
  content: IToastContent
  options: IToastOpts
}

type IToastContent = React.ReactNode

interface IToastOpts {
  autoDismiss?: boolean
  pauseOnHover?: boolean
  type: validIToastOptsTypes
}

interface ToastContext {
  add: (content: React.ReactNode) => string
  remove: (content: React.ReactNode) => void
  toasts: IToast[]
}
const ToastContext = React.createContext<ToastContext>({} as ToastContext)
const { Provider } = ToastContext

const defaultToastOpts: IToastOpts = {
  autoDismiss: true,
  pauseOnHover: true,
  type: 'positive',
}

export const ToastProvider = ({
  portalToRef,
  autoDismissTimeout = 5000,
  children,
}: ToastProvider) => {
  const [toasts, setToasts] = React.useState<IToast[]>([])
  const targetNode = portalToRef ? portalToRef.current : undefined
  // Create a container ref for rendering Portal children into
  const targetContainerRef = React.useRef(document.createElement('div'))

  // Use a ref to access the current toasts value in an async dismiss callback.
  const toastsRef = React.useRef(toasts)
  toastsRef.current = toasts

  const add = (
    content: IToastContent,
    options: IToastOpts = {} as IToastOpts
  ): string => {
    const toast = {
      id: uuid(),
      content,
      options: { ...defaultToastOpts, ...options },
    }
    setToasts([toast, ...toasts])
    return toast.id
  }

  const remove = (id: string) => {
    setToasts(toasts.filter(t => t.id !== id))
  }

  const onDismiss = (id: string) => () => {
    setToasts(toastsRef.current.filter(t => t.id !== id))
  }

  React.useEffect(() => {
    if (targetNode) {
      targetNode.appendChild(targetContainerRef.current)
    }
  }, [targetNode])

  return (
    <Provider value={{ add, remove, toasts }}>
      {children}

      {createPortal(
        <ToastContainer>
          {toasts.map(toast => (
            <ToastController
              key={toast.id}
              toast={toast}
              onDismiss={onDismiss(toast.id)}
              autoDismissTimeout={autoDismissTimeout}
            />
          ))}
        </ToastContainer>,
        targetContainerRef.current
      )}
    </Provider>
  )
}

export const useToasts = (): {
  addToast: (content: IToastContent, options?: IToastOpts) => string
  removeToast: (content: IToastContent) => void
  toastStack: IToast[]
} => {
  const { add, remove, toasts } = React.useContext(ToastContext)

  return { addToast: add, removeToast: remove, toastStack: toasts }
}
