import React from 'react';

export default function Button({children, onClick, title, style}) {
  return (
    <button className="button" onClick={onClick} style={style ? style : null}>
      {title ? title : children}
    </button>
  )
}
export const ButtonCard=React.memo(({txt, img, onClick})=>{
  const { REACT_APP_IMG_PATH } = process.env;
  return(
    <div className="button-card" onClick={onClick}>
      {img ?<img src={REACT_APP_IMG_PATH+"/assets/img"} alt=""/> : null}
      <div className="txt">
        <label>{txt}</label>
      </div>
    </div>
  )
})