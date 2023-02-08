import type { VProps } from "./types"

export const isEvent = (key: string) => key.startsWith("on")

export const isProperty = (key: string) => key !== "children" && !isEvent(key)

export const isNew = (prev: VProps, next: VProps) => (key: string) => prev[key] !== next[key]

export const transformAttr = (name: string) => name.toLowerCase() == 'classname' ? 'class' : name
