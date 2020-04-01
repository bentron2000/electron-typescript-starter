/**
 * --------------------------------------------------
 *
 *  useEditable - make any text element editable. Headings etc. Don't use for bigger stuff.
 *
 *  Usage:
 *  const Editable = () => {
 *
 *    const saveCallback = (value: string) =>
 *      console.log(`does something with ${value}`)
 *
 *    const sanitizeFunc = (value: string) =>
 *      console.log(`does something with ${value}`)
 *
 *    const validateFunc = (value: string) =>
 *      console.log(`does something with ${value}`)
 *
 *    const onFocusCallback = (value: string) =>
 *      console.log(`does something on focus`)
 *
 *    const onBlurCallback = (value: string) =>
 *      console.log(`does something on blur`)
 *
 *    const [editable] = useEditable({
 *      saveCallback,
 *      sanitizeFunc,
 *      validateFunc,
 *      onFocusCallback,
 *      onBlurCallback
 *    })
 *
 *    return (
 *      <div>
 *        <h1 {...editable} />
 *      </div>
 *    )
 *  }
 *
 * --------------------------------------------------
 */

// TODO Improvements yet to be made are:
//  - Implementation of sanitization, validation, keypress detection of enter => blur + save / escape => blur + cancel
//  - error/validation feedback etc...

import {
  useState,
  MutableRefObject,
  SyntheticEvent,
  KeyboardEvent,
} from 'react'

interface Editable {
  contentEditable: boolean
  onFocus: (event: SyntheticEvent) => void
  onBlur: (event: SyntheticEvent) => void
  suppressContentEditableWarning: boolean
  onKeyUp: (event: KeyboardEvent) => void
  ref: MutableRefObject<any>
}

export const useEditable = ({
  saveCallback,
  sanitizeFunc,
  validateFunc,
  onFocusCallback,
  onBlurCallback,
  onTabCallback,
  onEnterCallback,
  onEscapeCallback,
  saveOnEnter,
  ref,
}: {
  saveOnEnter?: boolean
  saveCallback?: (string: string) => void
  sanitizeFunc?: (string: string) => string
  validateFunc?: (string: string) => boolean
  onFocusCallback?: (event: SyntheticEvent, value: string) => void
  onBlurCallback?: (event: SyntheticEvent, value: string) => void
  onTabCallback?: (event: SyntheticEvent, value: string) => void
  onEnterCallback?: (event: SyntheticEvent, value: string) => void
  onEscapeCallback?: (event: SyntheticEvent, value: string) => void
  ref?: MutableRefObject<any>
}) => {
  const [originalValue, setOriginalValue] = useState<string>('')
  const [value, setValue] = useState<string>('')

  const handleFocus = (event: SyntheticEvent) => {
    setOriginalValue(event.currentTarget.textContent || '')
    if (onFocusCallback) {
      onFocusCallback(event, value)
    }
  }

  const handleChange = (event: SyntheticEvent) => {
    event.stopPropagation()
    // TODO: Sanitize / Validate / commit on enter / undo on escape etc
    console.log(
      `TODO: implement sanitize and validate... (formik, yup)`,
      sanitizeFunc,
      validateFunc
    )
    setValue(event.currentTarget.textContent || value)
    if ((event as KeyboardEvent).key === 'Tab' && onTabCallback) {
      onTabCallback(event, value)
    }
    if (
      saveOnEnter &&
      (event as KeyboardEvent).key === 'Enter' &&
      onEnterCallback
    ) {
      onEnterCallback(event, value)
      if (event.currentTarget) {
        (event.currentTarget as HTMLInputElement).blur()
      }
    }
    if ((event as KeyboardEvent).key === 'Escape' && onEscapeCallback) {
      onEscapeCallback(event, value)
    }
  }

  const handleSave = (event: SyntheticEvent) => {
    handleChange(event)
    if (!value) {
      return
    }

    if (saveCallback && !(originalValue === value)) {
      saveCallback(value)
    }
    if (onBlurCallback) {
      onBlurCallback(event, value)
    }
    // error handling? validation messages etc...
  }

  const editable = {} as Editable
  {
    editable.contentEditable = true
    editable.suppressContentEditableWarning = true
    editable.onBlur = event => handleSave(event)
    editable.onKeyUp = event => handleChange(event)
    editable.onFocus = event => handleFocus(event)
  }
  if (ref) {
    editable.ref = ref
  }

  return [editable]
}
