import globals from "../globals"
import { Hooks, VProps } from "../types"
import createHook from "./createHook"

type useStateHook<S> = {
  state: S,
  queue: ((s: S) => S)[]
}

type setStateType<S> = (partial: S | ((s: S) => S)) => void

type useStateReturn<S> = [S, setStateType<S>]

export default function useState<T>(initial: T): useStateReturn<T> {
  let hookValue = undefined as T
  
  const hook = createHook<useStateReturn<T>, useStateHook<T>>(
    Hooks.USE_STATE,
    (getData: (() => useStateHook<T>), setData: ((s: useStateHook<T>) => void)) => {
    const oldHook = getData() ?? {} as useStateHook<T>
    
    const hook = {
      state: oldHook.state ?? initial,
      queue: [],
    } as useStateHook<T>
  
    (oldHook.queue ?? []).forEach(action => {
      hook.state = action(hook.state)
    })

    hookValue = hook.state
  
    const setState: setStateType<T> = partial => {
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

    setData(hook)
    return setState
  })

  //@ts-ignore
  return [hookValue, hook]
}