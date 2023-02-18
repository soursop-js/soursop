import { Hooks, lifecycleHookFn } from '../types'
import createHook from './createHook'

//@ts-ignore
function _simpleHook(getData, setData) {
  return (callback: (() => void)) => {
    setData(callback)
  }
}

export const onCreated: lifecycleHookFn = createHook(Hooks.CREATED, _simpleHook)
export const onBeforeMount: lifecycleHookFn = createHook(Hooks.BEFORE_MOUNT, _simpleHook)
export const onMounted: lifecycleHookFn = createHook(Hooks.MOUNTED, _simpleHook)
export const onBeforeUpdate: lifecycleHookFn = createHook(Hooks.BEFORE_UPDATE, _simpleHook)
export const onUpdated: lifecycleHookFn = createHook(Hooks.UPDATED, _simpleHook)
export const onBeforeUnmount: lifecycleHookFn = createHook(Hooks.BEFORE_UNMOUNT, _simpleHook)
export const onUnmounted: lifecycleHookFn = createHook(Hooks.UNMOUNTED, _simpleHook)

export { default as useState } from './useState'
