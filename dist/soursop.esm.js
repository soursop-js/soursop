import classnames from 'classnames';

class Globals {
  constructor() {
    this.deletions = [];
    this.useStateIndex = 0;
  }
}
var globals = new Globals();
const Fragment = Symbol.for("Soursop.Fragment");

const isEvent = (key) => key.startsWith("on");
const isProperty = (key) => key !== "children" && !isEvent(key);
const isNew = (prev, next) => (key) => prev[key] !== next[key];
function normalizeAttrs(attrs) {
  const news = {};
  for (let [attr, val] of Object.entries(attrs)) {
    if (val == false) {
      continue;
    }
    if (attr.toLowerCase() === "classname") {
      attr = "class";
    }
    news[attr] = attr === "class" ? classnames(val) : val;
  }
  return news;
}
const isFunctionComponent = (fiber) => fiber.type instanceof Function;
function callHooks(lifecycle, hooks) {
  var _a, _b, _c;
  if (!hooks) {
    hooks = (_b = (_a = globals.wipFiber) == null ? void 0 : _a.alternate) == null ? void 0 : _b.hooks;
  }
  ((_c = hooks.get(lifecycle)) != null ? _c : []).forEach((hook) => hook());
}
function isSameType(newData, oldData) {
  return typeof newData == typeof oldData;
}
function isEquals(newData, oldData) {
  if (!isSameType(newData, oldData)) {
    return false;
  }
  if (typeof newData == "object") {
    if (Array.isArray(newData)) {
      const newLength = newData.length;
      const oldLength = oldData.length;
      return newLength == oldLength && newData.every((val, idx) => oldData.at(idx) == val);
    }
    const newKeys = Object.keys(newData);
    const oldKeys = Object.keys(oldData);
    const newValues = Object.values(newData);
    const oldValues = Object.values(oldData);
    return isEquals(newKeys, oldKeys) && isEquals(newValues, oldValues);
  }
  return newData === oldData;
}

function createElement(type, props, ...children) {
  children = children.filter((c) => ![null, void 0, false].includes(c));
  return {
    type,
    props: {
      ...normalizeAttrs(props != null ? props : {}),
      children: children.map(
        (child) => typeof child === "object" ? child : createTextElement(child)
      )
    }
  };
}
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text
      // children: [],
    }
  };
}

function updateDom(dom, prevProps, nextProps) {
  if (!Boolean(prevProps)) {
    prevProps = {};
  }
  if (!Boolean(nextProps)) {
    nextProps = {};
  }
  if (!dom["setAttribute"]) {
    if (prevProps.nodeValue == nextProps.nodeValue) {
      return;
    }
    dom.nodeValue = nextProps.nodeValue;
    return;
  }
  Object.keys(prevProps).filter(isEvent).filter(
    (key) => !(key in nextProps) || isNew(prevProps, nextProps)(key)
  ).forEach((name) => {
    const eventType = name.toLowerCase().substring(2);
    dom.removeEventListener(
      eventType,
      prevProps[name]
    );
  });
  Object.keys(prevProps).filter(isProperty).filter((key) => !(key in nextProps)).forEach((name) => {
    dom.removeAttribute(name);
  });
  Object.keys(nextProps).filter(isProperty).filter(isNew(prevProps, nextProps)).forEach((name) => {
    dom.setAttribute(name, nextProps[name]);
  });
  Object.keys(nextProps).filter(isEvent).filter(isNew(prevProps, nextProps)).forEach((name) => {
    const eventType = name.toLowerCase().substring(2);
    dom.addEventListener(
      eventType,
      nextProps[name]
    );
  });
}
function createDom(fiber) {
  const dom = fiber.type == "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(fiber.type);
  updateDom(dom, {}, fiber.props);
  return dom;
}

var Hooks = /* @__PURE__ */ ((Hooks2) => {
  Hooks2[Hooks2["BEFORE_CREATE"] = 0] = "BEFORE_CREATE";
  Hooks2[Hooks2["CREATED"] = 1] = "CREATED";
  Hooks2[Hooks2["BEFORE_MOUNT"] = 2] = "BEFORE_MOUNT";
  Hooks2[Hooks2["MOUNTED"] = 3] = "MOUNTED";
  Hooks2[Hooks2["BEFORE_UPDATE"] = 4] = "BEFORE_UPDATE";
  Hooks2[Hooks2["UPDATED"] = 5] = "UPDATED";
  Hooks2[Hooks2["BEFORE_UNMOUNT"] = 6] = "BEFORE_UNMOUNT";
  Hooks2[Hooks2["UNMOUNTED"] = 7] = "UNMOUNTED";
  Hooks2[Hooks2["USE_STATE"] = 8] = "USE_STATE";
  Hooks2[Hooks2["USE_WATCH"] = 9] = "USE_WATCH";
  return Hooks2;
})(Hooks || {});

function commitRoot() {
  var _a;
  ((_a = globals.deletions) != null ? _a : []).forEach(commitWork);
  commitWork(globals.wipRoot.child);
  globals.currentRoot = globals.wipRoot;
  globals.wipRoot = void 0;
}
function commitWork(fiber) {
  var _a;
  if (!fiber) {
    return;
  }
  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;
  if (fiber.effectTag === "PLACEMENT" && fiber.dom) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom) {
    updateDom(
      fiber.dom,
      (_a = fiber.alternate) == null ? void 0 : _a.props,
      fiber.props
    );
  } else if (fiber.effectTag === "DELETION") {
    try {
      commitDeletion(fiber, domParent);
    } catch (e) {
    }
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}
function commitDeletion(fiber, domParent) {
  if (isFunctionComponent(fiber)) {
    callHooks(Hooks.BEFORE_UNMOUNT, fiber.hooks);
  }
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  }
  if (isFunctionComponent(fiber)) {
    callHooks(Hooks.UNMOUNTED, fiber.hooks);
  }
  commitDeletion(fiber.child, domParent);
}

function updateFunctionComponent(fiber) {
  globals.wipFiber = fiber;
  globals.wipFiber.hooks = /* @__PURE__ */ new Map();
  if (!(fiber.type instanceof Function)) {
    return;
  }
  const isNew = fiber.effectTag == "PLACEMENT";
  const updating = fiber.effectTag == "UPDATE";
  const children = [fiber.type(fiber.props)];
  if (isNew) {
    callHooks(Hooks.CREATED, fiber.hooks);
    callHooks(Hooks.BEFORE_MOUNT, fiber.hooks);
  } else if (updating) {
    callHooks(Hooks.BEFORE_UPDATE, fiber.hooks);
  }
  reconcileChildren(fiber, children);
  if (isNew) {
    callHooks(Hooks.MOUNTED, fiber.hooks);
  } else if (updating) {
    callHooks(Hooks.UPDATED, fiber.hooks);
  }
}
function updateFragmentComponent(fiber) {
  if (fiber.type == Fragment) {
    reconcileChildren(fiber, fiber.props.children);
  }
}
function updateHostComponent(fiber) {
  var _a;
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  reconcileChildren(fiber, (_a = fiber.props) == null ? void 0 : _a.children);
}
function reconcileChildren(wipFiber, elements) {
  var _a;
  let index = 0;
  let oldFiber = (_a = wipFiber == null ? void 0 : wipFiber.alternate) == null ? void 0 : _a.child;
  let prevSibling = void 0;
  while (elements && index < elements.length || oldFiber) {
    const element = elements[index];
    let newFiber = void 0;
    const sameType = oldFiber && element && element.type == oldFiber.type;
    if (sameType) {
      newFiber = {
        type: oldFiber == null ? void 0 : oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE"
      };
    }
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        parent: wipFiber,
        effectTag: "PLACEMENT"
      };
    }
    if (oldFiber && !sameType) {
      let deletes = function(fiber) {
        fiber.effectTag = "DELETION";
        if (fiber.child) {
          if (fiber.parent.type == Fragment && fiber.sibling) {
            deletes(fiber.sibling);
          }
          deletes(fiber.child);
        }
      };
      deletes(oldFiber);
      globals.deletions.push(oldFiber);
    }
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }
    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }
}

function workLoop(deadline) {
  let shouldYield = false;
  while (globals.nextUnitOfWork && !shouldYield) {
    globals.nextUnitOfWork = performUnitOfWork(
      globals.nextUnitOfWork
    );
    shouldYield = deadline.timeRemaining() < 1;
  }
  if (!globals.nextUnitOfWork && globals.wipRoot) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}
function performUnitOfWork(fiber) {
  if (isFunctionComponent(fiber)) {
    updateFunctionComponent(fiber);
  } else if (fiber.type == Fragment) {
    updateFragmentComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

function render(element, container) {
  globals.wipRoot = {
    dom: container,
    props: {
      children: [element]
    },
    alternate: globals.currentRoot
  };
  globals.deletions = [];
  globals.nextUnitOfWork = globals.wipRoot;
  requestIdleCallback(workLoop);
}

function createHook(lifecycle, hookFn) {
  if (!(hookFn instanceof Function)) {
    throw Error("The second argument of `createHook` must be a function");
  }
  const getData = () => {
    var _a, _b, _c;
    const data = (_c = (_b = (_a = globals.wipFiber) == null ? void 0 : _a.alternate) == null ? void 0 : _b.hooks) == null ? void 0 : _c.get(lifecycle);
    if (data) {
      return data.at(-1);
    }
  };
  const setData = (hook) => {
    var _a, _b, _c;
    const hooks = (_c = (_b = (_a = globals.wipFiber) == null ? void 0 : _a.hooks) == null ? void 0 : _b.get(lifecycle)) != null ? _c : [];
    globals.wipFiber.hooks.set(lifecycle, [...hooks, hook]);
  };
  return hookFn(getData, setData);
}

function useState(initial) {
  let hookValue = void 0;
  const hook = createHook(
    Hooks.USE_STATE,
    (getData, setData) => {
      var _a, _b, _c;
      const oldHook = (_a = getData()) != null ? _a : {};
      const newHook = {
        state: (_b = oldHook == null ? void 0 : oldHook.state) != null ? _b : initial,
        queue: []
      };
      ((_c = oldHook.queue) != null ? _c : []).forEach((action) => {
        newHook.state = action(newHook.state);
      });
      hookValue = newHook.state;
      const setState = (partial) => {
        var _a2, _b2;
        if (!(partial instanceof Function)) {
          const _p = partial;
          partial = () => _p;
        }
        newHook.queue.push(partial);
        globals.wipRoot = {
          dom: (_a2 = globals.currentRoot) == null ? void 0 : _a2.dom,
          props: (_b2 = globals.currentRoot) == null ? void 0 : _b2.props,
          alternate: globals.currentRoot
        };
        globals.nextUnitOfWork = globals.wipRoot;
        globals.deletions = [];
      };
      setData(newHook);
      return setState;
    }
  );
  return [hookValue, hook];
}

const useWatch = createHook(Hooks.USE_WATCH, (getData, setData) => {
  return (callback, observables, immediate = false) => {
    const curState = { active: true, callback, observables };
    const oldState = getData();
    if (!oldState && immediate) {
      callback(curState.observables, void 0);
    }
    if (oldState && !oldState.active) {
      curState.active = oldState.active;
    }
    if (oldState && oldState.active && !isEquals(oldState.observables, curState.observables)) {
      oldState.callback(curState.observables, oldState.observables);
    }
    setData(curState);
    return () => {
      curState.active = false;
    };
  };
});

function _simpleHook(_getData, setData2) {
  return (callback) => {
    setData2(callback);
  };
}
const onCreated = createHook(Hooks.CREATED, _simpleHook);
const onBeforeMount = createHook(Hooks.BEFORE_MOUNT, _simpleHook);
const onMounted = createHook(Hooks.MOUNTED, _simpleHook);
const onBeforeUpdate = createHook(Hooks.BEFORE_UPDATE, _simpleHook);
const onUpdated = createHook(Hooks.UPDATED, _simpleHook);
const onBeforeUnmount = createHook(Hooks.BEFORE_UNMOUNT, _simpleHook);
const onUnmounted = createHook(Hooks.UNMOUNTED, _simpleHook);

export { Fragment, createElement, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onCreated, onMounted, onUnmounted, onUpdated, render, useState, useWatch };
