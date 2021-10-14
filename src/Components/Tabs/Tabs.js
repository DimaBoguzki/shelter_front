import React from 'react'

/**
 * @param {Object} tabs onject with key 
 */
export default function Tabs({callback, children, activeId}){
  const childrenWithProps = children.map( child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { callback, activeId });
    }
    return child;
  });
  return (
    <div className="tabs">
      {childrenWithProps}
    </div>
  )
}
export function Tab({id, value, callback, activeId}){
  return (
    <div className={activeId===id ? "tab active" : 'tab'} id={id} onClick={()=>callback(id, value)}>
      <span>{value}</span>
    </div>
  )
}