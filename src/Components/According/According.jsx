import React,{useState} from 'react';

function Accordion({children, title, isOpen, jsxHeader}) {
  const [toggle,setToggle] = useState(isOpen===true ? true : false);
  return (
    <div className='accordion-container'>
      <div className='action'>
        {title ? <>
        <div className='title'>
          <h4>{title}</h4>
        </div>
        <div className='icon' style={{transform: toggle ? 'rotate(90deg)' : 'rotate(270deg)'}} onClick={()=>{setToggle(!toggle)}}>
          <label>{'>'}</label>
        </div>
        </> : 
        jsxHeader ? 
        <div className="flex-container">
          <div className="icon col-lg-1" style={{transform: toggle ? 'rotate(90deg)' : 'rotate(270deg)'}} onClick={()=>{setToggle(!toggle)}}> 
            <label>{'>'}</label>
          </div>
          <div className='col-lg-11'>
            {jsxHeader}
          </div>
        </div>
        : null}
      </div>
      <div className='content-container' style={{maxHeight: toggle ? '100vh' : 0}}>
        <div className='content'>
          {children}
        </div>
      </div>
    </div>
  );
}

export default React.memo(Accordion);