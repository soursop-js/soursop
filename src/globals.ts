import type { Fiber } from "./types";

class Globals {
  public wipRoot?: Fiber;
  public wipFiber?: Fiber;
  public deletions: Fiber[] = []
  public nextUnitOfWork?: Fiber;
  public currentRoot?: Fiber;
  public useStateIndex = 0
}

// export default {
//   wipRoot,
//   wipFiber,
//   deletions,
//   nextUnitOfWork,
//   currentRoot,
//   useStateIndex
// }
export default new Globals()