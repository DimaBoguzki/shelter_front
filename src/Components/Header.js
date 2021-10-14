import React from 'react';
import { NavLink } from 'react-router-dom';
import userStorage from '../LocalStorage/userStorage';

export default class Header extends React.Component {
  render() { 
    return (
      <div className="container">
        <div className="flex-container">
          <nav>
            <NavLink exact to={'/'} >מקלט בזמן אמת</NavLink>
            <NavLink to={'/employee'}>עובדים</NavLink>
          </nav>
        </div>
      </div>
    );
  }
}