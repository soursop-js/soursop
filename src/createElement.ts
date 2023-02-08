import type { TPrimitive, VDom, VTextElement } from "./types"

export default function createElement(type: string, props: Record<string, unknown>, ...children: Array<VDom | TPrimitive>): VDom {
  children = children.filter(c => !['null', 'undefined'].includes(`${c}`))
  
  return {
    type,
    props: {
      ...props,
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
