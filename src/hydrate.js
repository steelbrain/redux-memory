// @flow

import isPrimitive from 'is-primitive'
import { TYPE_AS_IS } from './common'

export function validateScope(scope: Array<Function>) {
  const knownNames = new Set()

  scope.forEach((item, index) => {
    if (typeof item !== 'function') {
      throw new Error(`options.scope[${index}] must be a function/class`)
    }
    if (knownNames.has(item.name)) {
      throw new Error(`options.scope has encountered more than one occurance of '${item.name}'`)
    }
    knownNames.add(item.name)
  })
}

function dehydrateItem(obj: Object, scope: Array<Function>) {
  const { type, value: rawValue } = obj

  let value
  if (isPrimitive(rawValue)) {
    value = rawValue
  } else {
    value = Array.isArray(rawValue) ? [] : {}
    Object.keys(rawValue).forEach(function(key) {
      value[key] = dehydrateItem(rawValue[key], scope)
    })
  }

  if (type === TYPE_AS_IS || type === 'Object') {
    return value
  }

  const Creed = scope.find(i => i.name === type)
  if (!Creed) {
    throw new Error(`Unable to find '${type}' in given scope`)
  }

  return new Creed(value)
}

export default function hydrate(dehydrated: Object, scope: Array<Function>) {
  return dehydrateItem(dehydrated, scope)
}
