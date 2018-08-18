// @flow

import isPrimitive from 'is-primitive'
import { TYPE_AS_IS } from './common'

function traverseAndCopy(chunks: Array<string>, src: Object, dest: any) {
  const chunk = chunks.shift()

  const keys = chunk ? [chunk] : Object.keys(src)
  keys.forEach(function(key) {
    const value = src[key]

    if (typeof value === 'undefined') {
      return
    }

    let item
    if (isPrimitive(value)) {
      item = {
        type: TYPE_AS_IS,
        value,
      }
    } else {
      let jsValue = value
      const jsValueRef = value.toJS ? value.toJS() : value
      if (Array.isArray(jsValueRef) && jsValue.toArray) {
        jsValue = jsValue.toArray()
      } else if (jsValue.toObject) {
        jsValue = jsValue.toObject()
      } else {
        jsValue = jsValueRef
      }

      item = {
        type: value.constructor.name,
        value: Array.isArray(jsValue) ? [] : {},
      }

      traverseAndCopy(chunks, jsValue, item.value)
    }

    dest[key] = item
  })
}

export default function dehydrate(obj: Object, givenKeys: Array<string>) {
  const stateToPersist = { type: TYPE_AS_IS, value: {} }

  const keys = givenKeys.length ? givenKeys : Object.keys(obj)

  keys.forEach(function(key) {
    traverseAndCopy(key.split('.'), obj, stateToPersist.value)
  })

  return stateToPersist
}
