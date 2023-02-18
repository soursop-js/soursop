import globals from "./globals"
import type { Fiber, Hooks, HooksMap, VProps } from "./types"

export const isEvent = (key: string) => key.startsWith("on")

export const isProperty = (key: string) => key !== "children" && !isEvent(key)

export const isNew = (prev: VProps, next: VProps) => (key: string) => prev[key] !== next[key]

export const transformAttr = (name: string) => name.toLowerCase() == 'classname' ? 'class' : name

export const isFunctionComponent = (fiber: Fiber) => fiber.type instanceof Function;

export function callHooks(lifecycle: Hooks, hooks: HooksMap) {
  if(!hooks) {
    hooks = globals.wipFiber?.alternate?.hooks as HooksMap
  }

  ((hooks.get(lifecycle) ?? []) as (() => void)[]).forEach(hook => hook())
}