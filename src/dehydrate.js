// @flow

import isPrimitive from 'is-primitive'
import { TYPE_AS_IS } from './common'

function traverseAndCopy(serializeValue: Function, chunks: Array<string>, src: Object, dest: any) {
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
      const serializedValue = serializeValue(value)

      item = {
        type: value.constructor.name,
        value: Array.isArray(serializedValue) ? [] : {},
      }

      traverseAndCopy(serializeValue, chunks, serializedValue, item.value)
    }

    dest[key] = item
  })
}

export function defaultSerializeValue(value: any) {
  if (!value) return value

  let jsValue = value
  const jsValueRef = value.toJS ? value.toJS() : value
  if (Array.isArray(jsValueRef) && jsValue.toArray) {
    jsValue = jsValue.toArray()
  } else if (jsValue.toObject) {
    jsValue = jsValue.toObject()
  } else {
    jsValue = jsValueRef
  }
  return jsValue
}

export default function dehydrate(serializeValue: Function, obj: Object, givenKeys: Array<string>) {
  const stateToPersist = { type: TYPE_AS_IS, value: {} }

  const keys = givenKeys.length ? givenKeys : Object.keys(obj)

  keys.forEach(function(key) {
    traverseAndCopy(serializeValue, key.split('.'), obj, stateToPersist.value)
  })

  return stateToPersist
}
