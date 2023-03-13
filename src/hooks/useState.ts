import globals from "../globals"
import { Hooks, VProps } from "../types"
import createHook from "./createHook"

type useStateHook<S> = {
  state: S,
  queue: ((s: S) => S)[]
}

export type setState<S> = (partial: S | ((s: S) => S)) => void

type useStateReturn<S> = [S, setState<S>]

export default function useState<T>(initial?: T): useStateReturn<T> {
  let hookValue = undefined;
  
  const hook = createHook<setState<T>, useStateHook<T>>(
    Hooks.USE_STATE,
    (getData, setData) => {
    const oldHook = getData() ?? {} as useStateHook<T>
    
    const newHook = {
      state: oldHook?.state ?? initial,
      queue: [],
    } as unknown as useStateHook<T>
  
    (oldHook.queue ?? []).forEach(action => {
      newHook.state = action(newHook.state)
    })

    hookValue = newHook.state
  
    const setState = (partial: T | ((s: T) => T)) => {
      if (!(partial instanceof Function)) {
        const _p = partial
        partial = () => _p
      }
        
      newHook.queue.push(partial)
      globals.wipRoot = {
        dom: globals.currentRoot?.dom,
        props: globals.currentRoot?.props as VProps,
        alternate: globals.currentRoot,
      }
      globals.nextUnitOfWork = globals.wipRoot
      globals.deletions = []
    }

    setData(newHook)

    return setState
  })

  return [hookValue as unknown as T, hook]
}