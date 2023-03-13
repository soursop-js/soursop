import { isEquals } from "../utils"
import { Hooks } from "../types"
import createHook from "./createHook"

export type useWatchCb<O> = (newValue: O, oldValue: O) => void

type useWatchRaw<O> = {
  active: boolean
  callback: useWatchCb<O>
  observables: O
}

// type useWatchHook<O> = (callback: useWatchCb<O>, observables: O, immediate?: boolean) => () => void

const useWatch = createHook(Hooks.USE_WATCH, (getData, setData) => {
  return <O>(callback: useWatchCb<O>, observables: O, immediate = false) => {
    const curState: useWatchRaw<O> = { active: true, callback, observables }
    // const noWatch = () => { curState.active = false }

    const oldState = getData() as useWatchRaw<O>

    if(!oldState && immediate) {
      callback(curState.observables, undefined as O)
    }

    if (oldState && !oldState.active) {
      curState.active = oldState.active
    }

    if(oldState && oldState.active && !isEquals(oldState.observables, curState.observables)) {
      oldState.callback(curState.observables, oldState.observables)
    }

    setData(curState)
    return () => { curState.active = false }
  }
})

export default useWatch
