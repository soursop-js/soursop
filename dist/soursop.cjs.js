'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function createElement(type, props, ...children) {
  children = children.filter((c) => !["null", "undefined"].includes(`${c}`));
  return {
    type,
    props: {
      ...props,
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

class Globals {
  constructor() {
    this.deletions = [];
    this.useStateIndex = 0;
  }
}
var globals = new Globals();

const isEvent = (key) => key.startsWith("on");
const isProperty = (key) => key !== "children" && !isEvent(key);
const isNew = (prev, next) => (key) => prev[key] !== next[key];
const transformAttr = (name) => name.toLowerCase() == "classname" ? "class" : name;

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
    dom.removeAttribute(transformAttr(name));
  });
  Object.keys(nextProps).filter(isProperty).filter(isNew(prevProps, nextProps)).forEach((name) => {
    dom.setAttribute(transformAttr(name), nextProps[name]);
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
    commitDeletion(fiber, domParent);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}
function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
    return;
  }
  commitDeletion(fiber.child, domParent);
}

function updateFunctionComponent(fiber) {
  globals.wipFiber = fiber;
  globals.useStateIndex = 0;
  globals.wipFiber.hooks = [];
  if (!(fiber.type instanceof Function)) {
    return;
  }
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
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
      oldFiber.effectTag = "DELETION";
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
  if (fiber.type instanceof Function) {
    updateFunctionComponent(fiber);
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
  return Hooks2;
})(Hooks || {});

function createHook(lifecycle) {
  return (callback) => callback();
}

function useState(initial) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  const oldHook = (_e = (_d = (_c = (_b = (_a = globals.wipFiber) == null ? void 0 : _a.alternate) == null ? void 0 : _b.hooks) == null ? void 0 : _c.at(Hooks.USE_STATE)) == null ? void 0 : _d.at(globals.useStateIndex)) != null ? _e : {};
  const hook = {
    state: (_f = oldHook.state) != null ? _f : initial,
    queue: []
  };
  ((_g = oldHook.queue) != null ? _g : []).forEach((action) => {
    hook.state = action(hook.state);
  });
  const setState = (partial) => {
    var _a2, _b2;
    if (!(partial instanceof Function)) {
      const _p = partial;
      partial = () => _p;
    }
    hook.queue.push(partial);
    globals.wipRoot = {
      dom: (_a2 = globals.currentRoot) == null ? void 0 : _a2.dom,
      props: (_b2 = globals.currentRoot) == null ? void 0 : _b2.props,
      alternate: globals.currentRoot
    };
    globals.nextUnitOfWork = globals.wipRoot;
    globals.deletions = [];
  };
  const hooks = (_j = (_i = (_h = globals.wipFiber) == null ? void 0 : _h.hooks) == null ? void 0 : _i.at(Hooks.USE_STATE)) != null ? _j : [];
  globals.wipFiber.hooks[Hooks.USE_STATE] = [...hooks, hook];
  globals.useStateIndex += 1;
  return [hook.state, setState];
}

const onBeforeMount = createHook(Hooks.BEFORE_MOUNT);
const onMounted = createHook(Hooks.MOUNTED);
const onBeforeUpdate = createHook(Hooks.BEFORE_UPDATE);
const onUpdated = createHook(Hooks.UPDATED);
const onBeforeUnmount = createHook(Hooks.BEFORE_UNMOUNT);
const onUnmounted = createHook(Hooks.UNMOUNTED);

exports.createElement = createElement;
exports.onBeforeMount = onBeforeMount;
exports.onBeforeUnmount = onBeforeUnmount;
exports.onBeforeUpdate = onBeforeUpdate;
exports.onMounted = onMounted;
exports.onUnmounted = onUnmounted;
exports.onUpdated = onUpdated;
exports.render = render;
exports.useState = useState;
