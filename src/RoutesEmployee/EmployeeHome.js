import React from 'react';
import userStorage from '../LocalStorage/userStorage';
import { SheltersMap } from '../Components/Map/Map';
import Preload from '../Components/Preload/Preload';
import { ButtonCard } from '../Components/Button/Button';
import BreadCrumbs from '../Components/BreadCrumbs/BreadCrumbs';
import { isMobile } from "react-device-detect";

export default class EnployeeHome extends React.Component {
  constructor(props){
    super(props, null, null);
    const user=userStorage.getUser();
    if(!user)
      props.history.replace("/employee/login");
    this.state={
      preload : true,
      shelters:[]
    }
  }
  componentDidMount=()=>{    
    this.getShelters();
  }
  getShelters=()=>{
    this.props.post("ShelterData", "getItems", null)
    .then((data)=>{
      if(data.Data)
        this.setState({shelters:data.Data, preload:false});
      else{
        this.setState({preload:false});
        this.props.alert("שגיאה", data.Error, "error");
      }
    })
    .catch((err)=>{
      this.setState({preload:false})
      console.log(err);
    })
  }
  /* TODO render this func only in mobile */
  renderMain=()=>{
    return(
      <div className="butons flex-container" style={{justifyContent:'space-between'}}>
        {isMobile ?
        <div className="buton col-lg-3_5">
          <ButtonCard txt="דיווח מקלט" onClick={()=>this.props.history.push("/inspection-shelter")}/>
        </div> : null}
        <div className="buton col-lg-5_5">
          <ButtonCard txt="ניהול משתמשים" onClick={()=>this.props.history.push("/employee/users-admin")}/>
        </div>
        <div className="buton col-lg-5_5">
          <ButtonCard txt="ניהול מקלטים" onClick={()=>this.props.history.push("/employee/shelters-admin")}/>
        </div>
        <div className="buton col-lg-5_5">
          <ButtonCard txt="דוחות" onClick={()=>this.props.history.push("/employee/reports")} />
        </div>
      </div>
    )
  }
  render() { 
    const { preload, shelters } = this.state;
    return (
      <div className="page">
        <Preload preload={preload}/>
        <div className="container">
          <BreadCrumbs items={[{title:'עובדים', to:'#'}]} symbol=">"/>
          <SheltersMap shelters={shelters}/>
        </div>
      </div>
    );
  }
}
