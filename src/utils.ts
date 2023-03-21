import classnames from 'classnames'
import globals from "./globals"
import type { Fiber, Hooks, HooksMap, VProps } from "./types"

export const isEvent = (key: string) => key.startsWith("on")

export const isProperty = (key: string) => key !== "children" && !isEvent(key)

export const isNew = (prev: VProps, next: VProps) => (key: string) => prev[key] !== next[key]

export function normalizeAttrs(attrs: Record<string, unknown>) {
  const news = {} as Record<string, unknown>

  for(let [attr, val] of Object.entries(attrs)) {
    if(val == false) {
      continue
    }

    if(attr.toLowerCase() === 'classname') {
      attr = 'class'
    }

    news[attr] = attr === 'class' ? classnames(val) : val
  }

  return news
}

export const isFunctionComponent = (fiber: Fiber) => fiber.type instanceof Function;

export function callHooks(lifecycle: Hooks, hooks: HooksMap) {
  if(!hooks) {
    hooks = globals.wipFiber?.alternate?.hooks as HooksMap
  }

  ((hooks.get(lifecycle) ?? []) as (() => void)[]).forEach(hook => hook())
}

export function isSameType<N, O>(newData: N, oldData: O) {
  return (typeof newData == typeof oldData)
}

export function isEquals<N, O>(newData: N, oldData: O): boolean {
  if(!isSameType(newData, oldData)) {
    return false
  }

  if(typeof newData == 'object') {
    if(Array.isArray(newData)) {
      const newLength = newData.length
      const oldLength = (oldData as unknown[]).length
      return newLength == oldLength && newData.every((val, idx) => oldData.at(idx) == val)
    }

    const newKeys = Object.keys(newData as Record<string, unknown>)
    const oldKeys = Object.keys(oldData as Record<string, unknown>)

    const newValues = Object.values(newData as Record<string, unknown>)
    const oldValues = Object.values(oldData as Record<string, unknown>)

    return isEquals(newKeys, oldKeys) && isEquals(newValues, oldValues)
  }

  return newData === oldData
}