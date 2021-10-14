import React from 'react'
import './Input.scss';



export default function TexstArea({id, callBack, param, value, type, placeholder, style }){
  const [ val, setVal ] = React.useState(value ? value : '');
  return(
    <textarea 
      className='input text-area'
      style={style ? style  : {}}
      type={type ? type : 'text'}
      placeholder={placeholder ? placeholder : ''}
      value={val}
      onChange={e=>setVal(e.target.value)}
      onBlur={()=>callBack(id, param, val)}
    />
  )
}