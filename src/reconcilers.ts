import { createDom } from "./dom"
import globals, { Fragment } from "./globals"
import { Fiber, Hooks, VDom } from "./types"
import { callHooks } from "./utils"

export function updateFunctionComponent(fiber: Fiber) {
  globals.wipFiber = fiber
  // globals.useStateIndex = 0
  globals.wipFiber.hooks = new Map()

  if (!(fiber.type instanceof Function)) {
    return
  }

  const isNew = fiber.effectTag == "PLACEMENT"
  const updating = fiber.effectTag == "UPDATE"

  const children = [fiber.type(fiber.props)]

  if (isNew) {
    callHooks(Hooks.CREATED, fiber.hooks!)
    callHooks(Hooks.BEFORE_MOUNT, fiber.hooks!)
  } else if (updating) {
    callHooks(Hooks.BEFORE_UPDATE, fiber.hooks!)
  }

  reconcileChildren(fiber, children)

  if (isNew) {
    callHooks(Hooks.MOUNTED, fiber.hooks!);
  } else if (updating) {
    callHooks(Hooks.UPDATED, fiber.hooks!)
  }
}

export function updateFragmentComponent(fiber: Fiber) {
  if (fiber.type == Fragment) {
    reconcileChildren(fiber, fiber.props.children!)
  }
}

export function updateHostComponent(fiber: Fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  reconcileChildren(fiber, fiber.props?.children as VDom[])
}

export function reconcileChildren(wipFiber: Fiber, elements: VDom[]) {
  let index = 0
  let oldFiber = wipFiber?.alternate?.child
  let prevSibling: Fiber | undefined = undefined

  while (elements &&
    index < elements.length ||
    oldFiber
  ) {
    const element = elements[index]
    let newFiber: Fiber | undefined = undefined

    const sameType =
      oldFiber &&
      element &&
      element.type == oldFiber.type

    if (sameType) {
      newFiber = {
        type: oldFiber?.type,
        props: element.props,
        dom: (oldFiber as Fiber).dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      }
    }
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        parent: wipFiber,
        effectTag: "PLACEMENT",
      }
    }
    if (oldFiber && !sameType) {
      function deletes(fiber: Fiber) {
        fiber.effectTag = "DELETION"

        if (fiber.child) {
          if (fiber.parent.type == Fragment && fiber.sibling) {
            deletes(fiber.sibling)
          }

          deletes(fiber.child);
        }
      }

      deletes(oldFiber)
      globals.deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (index === 0) {
      wipFiber.child = newFiber
    } else if (element) {
      (prevSibling as Fiber).sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }
}
