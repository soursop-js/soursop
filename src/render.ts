import type { VDom } from "./types"
import globals from "./globals"
import { workLoop } from "./work"

export default function render(element: VDom, container: Element) {
  globals.wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: globals.currentRoot,
  }
  globals.deletions = []
  globals.nextUnitOfWork = globals.wipRoot

  requestIdleCallback(workLoop)
}