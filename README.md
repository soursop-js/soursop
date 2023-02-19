
# soursop

<p align="center">A small reactive tool for rich web pages</p>
<div align="center">
  <img alt="npm" src="https://img.shields.io/npm/v/soursop">
  <img alt="npm" src="https://img.shields.io/npm/dm/soursop">
  <img alt="NPM" src="https://img.shields.io/npm/l/soursop">
  <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/soursop">
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/natanfeitosa/soursop">
  <img alt="jsDelivr hits (npm)" src="https://img.shields.io/jsdelivr/npm/hm/soursop">
</div>

## Instalation

### Local

Via NPM:
```bash
npm i soursop
```
Via Yarn:
```bash
yarn add soursop
```

### CDN

NPM version
```html
<script src="https://cdn.jsdelivr.net/npm/soursop"></script>
```

GitHub (dev) version
```html
<script src="https://cdn.jsdelivr.net/gh/natanfeitosa/soursop/dist/soursop.iife.js"></script>
```

## Quickstart

We can create minimal app using cdn like this
```html
<div id="app"></div>
<!-- Load Soursop -->
<script src="https://cdn.jsdelivr.net/npm/soursop"></script>
<!-- Load Babel -->
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
//@jsx soursop.createElement
//@jsxFrag soursop.Fragment

function Counter() {
  const [count, setCount] = soursop.useState(0)
  return (
    <>
      <h1>Counter {count}</h1>
      <button onClick={() => setCount(count + 1)}>Click here</button>
    </>
  )
}

const container = document.querySelector('#app')
soursop.render(<Counter/>, container)
</script>
```

We can also use lifecycle hooks like `onCreated` or `onUnmounted`.

The signature of all lifecycle hooks looks like this:
```javascript
onLifecycleHook(callback: (() => void)): void
```

The currently implemented hooks are:
* `onCreated` and `onBeforeMount` - Called after `soursop` acquires the component structure
* `onMounted` - Called only after first mounting the component to the DOM
* `onBeforeUpdate` - Called before the component is updated in the DOM
* `onUpdated` - Called after the component is updated in the DOM
* `onBeforeUnmount` - Called before the component is removed from the DOM
* `onUnmounted` - Called after the component is removed from the DOM
