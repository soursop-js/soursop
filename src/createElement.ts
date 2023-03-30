import type { TPrimitive, VDom, VTextElement } from "./types"
import { normalizeAttrs } from './utils'

export default function createElement(type: string, props: Record<string, unknown>, ...children: Array<VDom | TPrimitive>): VDom {
  children = children.flat().filter(c => ![null, undefined, false].includes(<null | undefined | boolean>c))
  
  return {
    type,
    props: {
      ...normalizeAttrs(props ?? {}),
      children: children.map(child =>
        typeof child === "object"
          ? (child as VDom)
          : createTextElement(child)
      ),
    },
  }
}

function createTextElement(text: TPrimitive): VTextElement {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      // children: [],
    },
  }
}
