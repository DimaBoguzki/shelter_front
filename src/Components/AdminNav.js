import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Button from '../Components/Button/Button';
import userStorage from "../LocalStorage/User";
const AdminNav = () => {
  const [active, setActive] = useState(false);

  const { REACT_APP_IMG_PATH } = process.env;

  const exit=()=>{
    userStorage.clearUser();
    window.location = '/';
  }
  return(
    <div className="admin-nav">
      <div onClick={() => setActive(!active)} className="toggle">
        <img src={`${REACT_APP_IMG_PATH}/icons/admin_menu.svg`} alt="login"/>
      </div>
      <div className={active ? "admin-panel active" : "admin-panel"}>
        <div onClick={() => setActive(!active)} className="close">
          <img src={`${REACT_APP_IMG_PATH}/icons/admin/cross_dark.svg`} alt="login"/>
        </div>
        <ul>
          <li>
            <NavLink to={'/employee/users-admin'}>ניהול משתמשים</NavLink>
          </li>
          <li>
            <NavLink to={'/employee/shelters-admin'}>ניהול מקלטים</NavLink>
          </li>
          <li>
            <NavLink to={'/employee/inspections-admin'}>ביקורות מקלטים</NavLink>
          </li>
        </ul>
        <div className="buttons">
          <Button onClick={exit}>יציאה</Button>
        </div>
      </div>
    </div>
  );
}

export default AdminNav;
