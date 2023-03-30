import type { RDom, VProps, Fiber } from "./types"
import { isEvent, isNew, isProperty } from "./utils"

export function updateDom(dom: RDom, prevProps: VProps, nextProps: VProps) {
  if(!Boolean(prevProps)) {
    prevProps = {}
  }

  if(!Boolean(nextProps)) {
    nextProps = {}
  }
  //@ts-ignore
  if(!dom['setAttribute']) {
    if(prevProps.nodeValue == nextProps.nodeValue) {
      return
    }
    
    dom.nodeValue = nextProps.nodeValue as string
    return
  }
  
  //Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(
      key =>
        !(key in nextProps) ||
        isNew(prevProps, nextProps)(key)
    )
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.removeEventListener(
        eventType,
        prevProps[name] as EventListenerOrEventListenerObject
      )
    })

  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(key => !(key in nextProps))
    .forEach(name => {
      (dom as Element).removeAttribute(name)
    })

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {      
      (dom as Element).setAttribute(name, nextProps[name] as string)
    })

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.addEventListener(
        eventType,
        nextProps[name] as EventListenerOrEventListenerObject
      )
    })
}

export function createDom(fiber: Fiber) {
  const dom: RDom =
    fiber.type == 'TEXT_ELEMENT'
      ? document.createTextNode("")
      : document.createElement(fiber.type as string)

  updateDom(dom, {} as VProps, fiber.props)
  return dom
}