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

declare function createElement(type: string, props: Record<string, unknown>, ...children: Array<VDom | TPrimitive>): VDom;

declare function render(element: VDom, container: Element): void;

declare const Fragment: unique symbol;

type setState<S> = (partial: S | ((s: S) => S)) => void;
type useStateReturn<S> = [S, setState<S>];
declare function useState<T>(initial?: T): useStateReturn<T>;

type useWatchCb<O> = (newValue: O, oldValue: O) => void;
declare const useWatch: <O>(callback: useWatchCb<O>, observables: O, immediate?: boolean) => () => void;

declare const onCreated: (callback: (() => void)) => void;
declare const onBeforeMount: (callback: (() => void)) => void;
declare const onMounted: (callback: (() => void)) => void;
declare const onBeforeUpdate: (callback: (() => void)) => void;
declare const onUpdated: (callback: (() => void)) => void;
declare const onBeforeUnmount: (callback: (() => void)) => void;
declare const onUnmounted: (callback: (() => void)) => void;

export { Fragment, createElement, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onCreated, onMounted, onUnmounted, onUpdated, render, setState, useState, useWatch, useWatchCb };
