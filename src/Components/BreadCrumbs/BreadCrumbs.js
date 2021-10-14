import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';

/**
 * @param {Array} items array [{to,title},.......]
 * @param {String} symbol 
 */
function BreadCrumbs({items, symbol}){
  const len = (items.length-1);
  const s = symbol ? symbol : '/';
  const history=useHistory();
  return (
    <ul className="bread-crumbs-d flex-container">
      <li className="li-d">
        <label className="item" onClick={()=>history.goBack()}>{" חזרה <"}</label>
      </li>
      {items.map((el,i)=>{
        return(
          <li key={i} className="li-d">
            <NavLink to={el.to} replace={true} className="item">
              {el.title}
            </NavLink>
            {len!==i ? <span className="symbol">{s}</span> : null}
          </li>
        )
      })}
    </ul>
  )
}
export default BreadCrumbs;