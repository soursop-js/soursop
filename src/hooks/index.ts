import { Hooks } from '../types'
import createHook from './createHook'

export const onBeforeMount = createHook(Hooks.BEFORE_MOUNT)
export const onMounted = createHook(Hooks.MOUNTED)
export const onBeforeUpdate = createHook(Hooks.BEFORE_UPDATE)
export const onUpdated = createHook(Hooks.UPDATED)
export const onBeforeUnmount = createHook(Hooks.BEFORE_UNMOUNT)
export const onUnmounted = createHook(Hooks.UNMOUNTED)

export { default as useState } from './useState'