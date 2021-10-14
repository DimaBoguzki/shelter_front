import React,{ useState } from 'react';
import './Input.scss';

function Input({id, callBack, param, value, type, placeholder, style }){
  const [ val, setVal ]=useState(value ? value : '');
  return (
    <input
      className='input'
      style={style ? style  : {}}
      type={type ? type : 'text'}
      placeholder={placeholder ? placeholder : ''}
      value={val}
      onChange={e=>setVal(e.target.value)}
      onBlur={()=>callBack(id, param, val)}
    />
  )
}
export default React.memo(Input); 
