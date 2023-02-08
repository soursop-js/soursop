import { updateDom } from "./dom"
import globals from "./globals"
import type { Fiber, RDom, VProps } from "./types"

export function commitRoot() {
  (globals.deletions ?? []).forEach(commitWork)
  commitWork((globals.wipRoot as unknown as Fiber).child)
  
  globals.currentRoot = globals.wipRoot
  globals.wipRoot = undefined
}

export function commitWork(fiber?: Fiber) {
  if (!fiber) {
    return
  }

  let domParentFiber = fiber.parent as Fiber
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent as Fiber
  }
  
  const domParent = domParentFiber.dom

  if (
    fiber.effectTag === "PLACEMENT" &&
    fiber.dom
  ) {
    domParent.appendChild(fiber.dom)
  } else if (
    fiber.effectTag === "UPDATE" &&
    fiber.dom
  ) {
    updateDom(
      fiber.dom,
      fiber.alternate?.props as VProps,
      fiber.props
    )
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent)
  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

export function commitDeletion(fiber: Fiber, domParent: RDom) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom)
    return
  }
  
  commitDeletion(fiber.child as Fiber, domParent)
}
