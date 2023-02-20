type TPrimitive = string | number | boolean | null | undefined;
type FC<P> = (props: P) => VDom;
type VElement = {
    type: string;
    props: VProps;
};
type VComponentElement<P> = {
    type: FC<P>;
    props: VProps;
};
type VTextElement = {
    type: 'TEXT_ELEMENT';
    props: VProps & {
        nodeValue: TPrimitive;
    };
};
type VFragment = {
    type: symbol;
    props: {
        childrens: VDom[];
    };
};
type VDom = VElement | VComponentElement<Record<string, unknown>> | VTextElement | VFragment;
type VProps = Record<string, unknown> & {
    children?: VDom[];
};
type lifecycleHookFn = ((callback: (() => void)) => void);

declare function createElement(type: string, props: Record<string, unknown>, ...children: Array<VDom | TPrimitive>): VDom;

declare function render(element: VDom, container: Element): void;

declare const Fragment: unique symbol;

type setStateType<S> = (partial: S | ((s: S) => S)) => void;
type useStateReturn<S> = [S, setStateType<S>];
declare function useState<T>(initial: T): useStateReturn<T>;

declare const onCreated: lifecycleHookFn;
declare const onBeforeMount: lifecycleHookFn;
declare const onMounted: lifecycleHookFn;
declare const onBeforeUpdate: lifecycleHookFn;
declare const onUpdated: lifecycleHookFn;
declare const onBeforeUnmount: lifecycleHookFn;
declare const onUnmounted: lifecycleHookFn;

export { Fragment, createElement, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onCreated, onMounted, onUnmounted, onUpdated, render, useState };
