import { updateDom } from "./dom"
import globals from "./globals"
import { Hooks, Fiber, RDom, VProps } from "./types"
import { callHooks, isFunctionComponent } from "./utils"

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
    try {
      commitDeletion(fiber, domParent);
    } catch (e) { }
  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

export function commitDeletion(fiber: Fiber, domParent: RDom) {
  if (isFunctionComponent(fiber)) {
    callHooks(Hooks.BEFORE_UNMOUNT, fiber.hooks!);
  }
  
  if (fiber.dom) {
    domParent.removeChild(fiber.dom)
  }

  if (isFunctionComponent(fiber)) {
    callHooks(Hooks.UNMOUNTED, fiber.hooks!);
  }
  
  commitDeletion(fiber.child as Fiber, domParent)
}
