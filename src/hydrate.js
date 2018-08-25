// @flow

import isPrimitive from 'is-primitive'
import { TYPE_AS_IS } from './common'

export function validateKnownTypes(knownTypes: Array<Function>) {
  const knownNames = new Set()

  knownTypes.forEach((item, index) => {
    if (typeof item !== 'function') {
      throw new Error(`options.knownTypes[${index}] must be a function/class`)
    }
    if (knownNames.has(item.name)) {
      throw new Error(`options.knownTypes has encountered more than one occurance of '${item.name}'`)
    }
    knownNames.add(item.name)
  })
}

function dehydrateItem(obj: Object, knownTypes: Array<Function>) {
  const { type, value: rawValue } = obj

  let value
  if (isPrimitive(rawValue)) {
    value = rawValue
  } else {
    value = Array.isArray(rawValue) ? [] : {}
    Object.keys(rawValue).forEach(function(key) {
      value[key] = dehydrateItem(rawValue[key], knownTypes)
    })
  }

  if (type === TYPE_AS_IS || type === 'Object' || type === 'Array') {
    return value
  }

  const Creed = knownTypes.find(i => i.name === type)
  if (!Creed) {
    throw new Error(`Unable to find '${type}' in given knownTypes`)
  }

  const hydrated = new Creed(value)
  // This is require for ImmutableJS::Record
  if (typeof hydrated === 'function') {
    return hydrated()
  }
  return hydrated
}

export default function hydrate(dehydrated: ?Object, knownTypes: Array<Function>) {
  if (!dehydrated) {
    return {}
  }

  return dehydrateItem(dehydrated, knownTypes)
}
