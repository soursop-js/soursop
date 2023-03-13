export const enum Hooks {
  BEFORE_CREATE,
  CREATED,
  BEFORE_MOUNT,
  MOUNTED,
  BEFORE_UPDATE,
  UPDATED,
  BEFORE_UNMOUNT,
  UNMOUNTED,
  USE_STATE,
  USE_WATCH,
}

export type HooksMap = Map<Hooks, unknown[]>

export type TPrimitive = string | number | boolean | null | undefined

export type FC<P> = (props: P) => VDom

export type VElement = {
  type: string
  props: VProps
}

export type VComponentElement<P> = {
  type: FC<P>
  props: VProps
}

export type VTextElement = {
  type: 'TEXT_ELEMENT'
  props: VProps & {
    nodeValue: TPrimitive,
  }
}

export type VFragment = {
  type: symbol
  props: {
    childrens: VDom[]
  }
}

export type VDom = VElement | VComponentElement<Record<string, unknown>> | VTextElement | VFragment

export type VProps = Record<string, unknown> & {
  children?: VDom[]
}

export type RDom = Text | Element

export type Fiber = {
  dom?: RDom
  type?: VDom['type']
  props: VProps
  parent?: Fiber
  alternate?: Fiber
  sibling?: Fiber
  child?: Fiber
  hooks?: HooksMap
  effectTag?: 'UPDATE' | 'PLACEMENT' | 'DELETION'
}

export type getData<D> = () => D | void

export type setData<D> = (hook: D) => void

export type hookRaw<R, D> = (getData: getData<D>, setData: setData<D>) => R