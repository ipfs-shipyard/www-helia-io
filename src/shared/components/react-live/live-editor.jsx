import React, { useEffect, useState } from 'react'
import { Editor } from 'react-live'
import okaidia from './okaidia.js'

export default function LiveEditor ({ code, onChange, ...rest }) {
  // react-live sets up its contentEditable in a layout effect keyed on its own
  // ref, and that ref reads as null on the first render and as the <pre> on the
  // second. The effect therefore always tears itself down and re-attaches once,
  // which resets contentEditable and drops focus. Force that second render at
  // mount so it happens before anyone is typing: otherwise it lands on the
  // first keystroke and the rest of the word goes nowhere. react-live's own
  // demo gets this render for free from LiveProvider, we do not.
  const [, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Editor
      theme={ okaidia }
      padding={ 15 }
      { ...rest }
      code={ code }
      onChange={ onChange }
    />
  )
}
