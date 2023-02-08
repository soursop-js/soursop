import globals from "../globals"
import { Hooks, VProps } from "../types"

type useStateHook<S> = {
  state: S,
  queue: ((s: S) => S)[]
}

type useStateReturn<S> = [S, (partial: S | ((s: S) => S)) => void]

export default function useState<T>(initial: T): useStateReturn<T> {
  const oldHook =
    ((globals.wipFiber?.alternate?.hooks?.at(Hooks.USE_STATE) as useStateHook<any>[][])?.at(globals.useStateIndex) ?? {}) as useStateHook<T>
  
  const hook = {
    state: oldHook.state ?? initial,
    queue: [],
  } as useStateHook<T>

  (oldHook.queue ?? []).forEach(action => {
    hook.state = action(hook.state)
  })

  const setState = (partial: T | ((s: T) => T)) => {
    if (!(partial instanceof Function)) {
      const _p = partial
      partial = () => _p
    }
      
    hook.queue.push(partial)
    globals.wipRoot = {
      dom: globals.currentRoot?.dom,
      props: globals.currentRoot?.props as VProps,
      alternate: globals.currentRoot,
    }
    globals.nextUnitOfWork = globals.wipRoot
    globals.deletions = []
  }
  
  const hooks = globals.wipFiber?.hooks?.at(Hooks.USE_STATE) ?? []
  //@ts-ignore
  globals.wipFiber.hooks[Hooks.USE_STATE] = [...hooks, hook]
  globals.useStateIndex += 1
  return [hook.state, setState]
}
