// import globals from "src/globals";
import { Hooks } from "../types";

// export default function createHook(lifecycle: Hooks) {
//   return (callback: () => void): void => {
//     globals.wipFiber.alternate.hooks.at(lifecycle) = []

//     hooks.push(callback)
//   }
// }

export default function createHook(lifecycle: Hooks) {
  return (callback: () => void): void => callback()
}
