import React from 'react';
import Preload from '../Preload/Preload';

export default function PageTwoHalves({children, preload}){
  const ref = React.useRef(null);
  const [ toggle, setToggle ]=React.useState(false);
  const { REACT_APP_IMG_PATH } = process.env;

  React.useEffect(()=>{
    if(ref && ref.current.children.length == 2){
      const imgDom=document.getElementById('swipe-page-half');
      if(!imgDom){
        const img = document.createElement('img');
        img.src=REACT_APP_IMG_PATH+"/icons/Swipe.svg";
        img.setAttribute('id','swipe-page-half')
        img.classList.add("swipe");
        img.onclick=()=>setToggle(prev=>!prev);
        ref.current.children[1].appendChild(img)
      }
    }
    if(ref && ref.current.children.length == 2){
      if(toggle){
        ref.current.children[0].style.height="50vh";
        ref.current.children[1].style.height="50vh";
      }
      else{
        ref.current.children[0].style.height="97vh";
        ref.current.children[1].style.height="3vh";
      }
    }
    else if(ref && ref.current.children.length == 1){
      ref.current.children[0].style.height="100vh";
    }
  },[toggle])
  
  return(
    <div className="page-two-halves" ref={ref}>
      {children}
    </div>
  )
}
export function Half({ children, toggle, preload }){
  return (
    <div className={"primary"} type="half">
      <Preload preload={preload}/>
      {children}
    </div>
  )  
}