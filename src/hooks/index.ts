import { Hooks, getData, setData } from '../types'
import createHook from './createHook'

function _simpleHook(_getData: getData<() => void>, setData: setData<() => void>) {
  return (callback: (() => void)) => {
    setData(callback)
  }
}

export const onCreated = createHook(Hooks.CREATED, _simpleHook)
export const onBeforeMount = createHook(Hooks.BEFORE_MOUNT, _simpleHook)
export const onMounted = createHook(Hooks.MOUNTED, _simpleHook)
export const onBeforeUpdate = createHook(Hooks.BEFORE_UPDATE, _simpleHook)
export const onUpdated = createHook(Hooks.UPDATED, _simpleHook)
export const onBeforeUnmount = createHook(Hooks.BEFORE_UNMOUNT, _simpleHook)
export const onUnmounted = createHook(Hooks.UNMOUNTED, _simpleHook)

export { default as useState, type setState } from './useState'