import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import Header from './Components/Header';
import EmployeeHome from './RoutesEmployee/EmployeeHome';
import EmployeeLogin from './RoutesEmployee/EmployeeLogin';
import SheltersAdmin from './admin/SheltersAdmin';
import InspectionsAdmin from './admin/InspectionsAdmin';
import ShelterWorkAdmin from './admin/ShelterWorkAdmin';
import UsersAdmin from './admin/UsersAdmin';
import UserMain from './RoutesUser/UserMain';
import Inspection from './RoutesEmployee/Inspection';
import Shelter from './admin/Shelter';
import Report from './RoutesEmployee/Reports';
import AdminMenu from './Components/AdminMenu/AdminMenu';

import './App.scss';

import userStorage from './LocalStorage/userStorage';

export default class App extends React.Component {
  state={
    widthScreen: window.outerWidth,
  }
  componentDidMount(){
		window.addEventListener('resize', this.updateWindowDimensions);
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}
	updateWindowDimensions=()=>{
		this.setState({widthScreen: window.outerWidth});
	}
  alert=(title, text, type)=>{
		Swal.fire({
			title: title,
			text: text,
			icon: type,
			showConfirmButton: false,
			timer: 3000
    })
	}
  post=(point, action, params)=>{
    if(!point || !action)
      console.error("The funcion must recive point and action");
    const user=userStorage.getUser();
    const data={
      point: point,
      action: action,
      params: {
        userId: user ? user.Id : null,
        token: user ? user.Token : null,
        ...params
      }
    }
    return new Promise((resolve, reject) => {
      return axios({
        method: 'post',
        url: `${process.env.REACT_APP_ENTRY_POINT}`, 
        data: JSON.stringify(data),
      })
      .then(data=>resolve(data.data))
      .catch(err=>reject(err))
    })
  }
  render(){
    return (
      <Router>
        <Switch>
          {/* User */}
          <Route exact={true} path="/">
            <UserRoutes {...this} />
          </Route>
          { /* Employee */}
          <Route path="/employee" >
            <EmployeeRoutes {...this}/>
          </Route>
        </Switch>
      </Router>
    );
  }
}

const UserRoutes=(props)=>{
  return (
    <>
    <header id="header">
      <Header {...props} />
    </header>
    <Switch>
      <Route exact path="/" render={(prop) => (<UserMain {...prop}{...props} />)} />
    </Switch>
    </>
  )
}

const EmployeeRoutes=(props)=>{
  return(
    <div className="employee">
    <AdminMenu {...props}/>
    <Switch>
      <Route exact path="/employee" render={(prop) => (<EmployeeHome {...prop}{...props}/>)} />
      <Route path="/employee/login" render={(prop) => (<EmployeeLogin {...prop}{...props}/>)} />
      <Route path="/employee/inspection-shelter" render={(prop) => (<Inspection {...prop}{...props}/>)} />
      <Route path="/employee/reports" render={(prop) => (<Report {...prop}{...props}/>)} />
      {/* Admin */}
      <Route path="/employee/shelters-admin" render={(prop) => (<SheltersAdmin {...prop}{...props}/>)} />
      <Route path="/employee/inspections-admin/:id" render={(prop) => (<InspectionsAdmin {...prop}{...props}/>)} />
      <Route path="/employee/users-admin" render={(prop) => (<UsersAdmin {...prop}{...props}/>)} />
      <Route path="/employee/shelter/:id" render={(prop) => (<Shelter {...prop}{...props}/>)} />
      <Route path="/employee/shelter-work/:id" render={(prop) => (<ShelterWorkAdmin key={prop.match.params.id+'shelter-work'} {...prop}{...props}/>)} />
    </Switch>
    </div>
  )
}