import React from 'react';
import { NavLink } from 'react-router-dom';
import userLocalStorage from '../../LocalStorage/userStorage';

export default function AdminMenu(props){
  const user = userLocalStorage.getUser();
  const [ toggle, setToggle ] = React.useState(true);
  const { REACT_APP_IMG_PATH } = process.env;
  const handleExit=()=>{
    window.location.replace("/");
    localStorage.clear();
  }
  return(
    <nav className={toggle ? "admin-menu" : "admin-menu toggle"}>
      <div className="swipe" onClick={()=>setToggle(prev=>!prev)}>
        <img src={REACT_APP_IMG_PATH+"/icons/swipe.svg"} alt=""/>
      </div>
      <div className="top">
        <div className="img">
          <img src={REACT_APP_IMG_PATH+"/icons/user-entry.svg"} alt=""/>
        </div>
        <div className="info">
          <p>{user ? user.Name : 'שלום'}</p>
          <p className="small">{user ? user.Mail : ''}</p>
          <button className="exit" onClick={handleExit}><span>יציאה</span></button>
        </div>
      </div>
      <ul>
        <li>
          <NavLink exact to="/employee" activeClassName="active">
            <div className="img first"><img src={REACT_APP_IMG_PATH+"/icons/menu/dashboard.svg"} alt=""/></div>
            <span>דשבורג</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/employee/users-admin" activeClassName="active">
            <div className="img"><img src={REACT_APP_IMG_PATH+"/icons/menu/products.svg"} alt=""/></div>
            <span>משתמשים</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/employee/shelters-admin" activeClassName="active">
            <div className="img"><img src={REACT_APP_IMG_PATH+"/icons/menu/dashboard.svg"} alt=""/></div>
            <span>מקלטים</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/employee/reports" activeClassName="active">
            <div className="img last"><img src={REACT_APP_IMG_PATH+"/icons/menu/dashboard.svg"} alt=""/></div>
            <span>דוחות</span>
          </NavLink>
        </li>
      </ul>
      <div className="bottom">
        <img src={REACT_APP_IMG_PATH+"/assets/logo-menu.svg"}  alt="logo"/>
      </div>
    </nav>
  )
}