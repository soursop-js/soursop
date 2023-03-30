import globals from "../globals"
import { hookRaw, Hooks } from "../types"

export default function createHook<R, D>(lifecycle: Hooks, hookFn: hookRaw<R, D>): R {
  if(!(hookFn instanceof Function)) {
    throw Error('The second argument of `createHook` must be a function')
  }
  
  const getData = () => {
    const data = globals.wipFiber?.alternate?.hooks?.get(lifecycle)
    if(data) {
      const currents = globals.wipFiber?.hooks?.get(lifecycle) ?? []
      return data.at(currents.length) as D
    }
  }

  const setData = (hook: D) => {
    const hooks = (globals.wipFiber?.hooks?.get(lifecycle) ?? []) as D[]

    //@ts-ignore
    globals.wipFiber.hooks.set(lifecycle, [ ...hooks, hook ])
  }

  return hookFn(getData, setData)
}