import React from 'react';
import './Input.scss';
/**
 * @param { Function } callback to parent with (id,partName,value).
 * @param { Number } id of value will cahnge.
 * @param { String } paramName name column id Data Base will change.
 * @param { Boolean } value first value of input.
 * @param { String } title title of input.
 * @param { Boolean } clear 
 * @param { Boolean } big style 
 * @param { String } direction ltr/ rtl
 * @param { Boolean } invert if the true is null
 */

function CheckBox({callback, title, id, value, paramName, clear, big, direction, invert}) {
  const handleClick=()=>{
    let val=null;
    if(invert)
      val=value ? 1 : null;
    else
      val=value ? null : 1;
    
    callback( val, id, paramName);
  }

  let style={
    direction: direction==='rtl' ? 'ltr' : 'rtl'
  }
  const { REACT_APP_IMG_PATH } = process.env;
  return(
    <div className="checkbox-input-d" style={style}>
      <label className="title">{title}</label>
      <div className={big ? 'action-check-box big' : 'action-check-box'} onClick={handleClick} style={{backgroundColor: value ? "#01a9ac" : clear ? 'transparent': "#e36159"}}>
        {
          value ? <img src={REACT_APP_IMG_PATH+"/icons/admin/done.svg"} alt=""/> 
          : clear ? null
          : <img src={REACT_APP_IMG_PATH+"/icons/admin/cross.svg"} alt=""/>}
      </div>
    </div>
  )
};

export default React.memo(CheckBox);