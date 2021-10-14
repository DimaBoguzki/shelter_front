import React from 'react'
import Preload from '../Components/Preload/Preload';
import TextArea from '../Components/Inputs/TextArea';
import Button from '../Components/Button/Button';
import userStorage from '../LocalStorage/userStorage';
import { MapTools } from '../Components/Map/Map';
import BreadCrumbs from '../Components/BreadCrumbs/BreadCrumbs';


export default class Inspection extends React.Component {
  constructor(props){
    super(props, null, null);
    const user=userStorage.getUser();
    if(!user)
      props.history.replace("/employee/login");
    else if(user.Role==!'auditer' && !user.Role==!'super_user'){
      props.alert('המשתמש אינו מבקר','','error');
      props.history.goBack();
    }
    const shelter=(this.props.location.state && this.props.location.state.shelter) ? 
                      this.props.location.state.shelter : this.props.shelter ? this.props.shelter : null
    this.state = {
      preload: shelter ? false : true,
      shelterReport: shelter,
      txt:(shelter && shelter.Report) ? shelter.Report : ''
    }
  }
  componentDidMount=()=>{  
    if(!this.state.shelterReport){
      MapTools.getCurentPostion()
      .then((data)=>{
        this.getShelters({
          lat: data.latitude,
          lng: data.longitude
        },10);
      })
      .catch((err)=>console.log(err))  
    }
  }
  getShelters = (curentPostion, radius) => {
    this.props.post("ShelterData","getSheltersByRadius", {
      curentPostion: curentPostion,
      radius: radius,
    })
    .then((data)=>{
      console.log(data);
      if(data.Data.length > 0){
        const shelter=data.Data.sort((a,b)=>a.Distance < b.Distance ? -1 : a.Distance < b.Distance ?  1 : 0)
        this.setState({shelterReport:shelter[0], preload:false});
      }
      else{
        MapTools.getAddress(curentPostion.lat, curentPostion.lng)
        .then(d=>console.log(d,"current"))
        this.props.alert("אינך ליד מקלט", "נסה שנית", 'warning')
        this.setState({preload: false})
      }
    })
    .catch((err)=>{
      this.props.alert("אינך מחובר לרשת","בדוק את החיבור שלך","error");
      console.log(err);
      this.setState({preload:false});
    })
  }
  /**
   * check posrion employee if there near shkter, if yes setstate 
   */
  handleCheckNearShelter = async () => {
    this.setState({preload: true})
    MapTools.getCurentPostion()
    .then((data)=>{
      this.getShelters({
        lat: data.latitude,
        lng: data.longitude
      },10);
    })
    .catch((err)=>console.log(err))  

  }
  handleReport=()=>{
    const { txt, shelterReport } = this.state;
    const user=userStorage.getUser();
    this.setState({preload: true})
    this.props.post("InspectionData", "reportShelter", { shelterId:shelterReport.Id, auditerId: user.Id, report: txt})
    .then((data)=>{
      if(data.Data){
        this.props.alert("דיווח נקלט בהצלחה", "", "success");
        this.props.history.replace('/employee/inspections-admin/'+shelterReport.Id)
      }
      else
        this.props.alert("הדייוח לא נקלט",data.Error, "error");
      this.setState({preload: false})
    })
    .catch((err)=>{
      this.props.alert("תקלה", "פנה לשירות לקוחות", "error");
      console.log(err);
    })
  }
  getBreadCrumbs(){
    const { shelterReport } = this.state;
    const arr=[  {title:'עובדים', to:'/employee'},];
    if(shelterReport){
      arr.push(
        {title:'ניהול מקלטים', to:'/employee/shelters-admin'},
        {title:'ביקורת מקלט', to:'/employee/inspections-admin/'+shelterReport.Id}
      )
    }
    return arr;
  }
  render() { 
    const { preload, txt, shelterReport } = this.state;
    if(shelterReport){
      return ( // if employee new shelter to repoty
        <div className="page">
          <Preload preload={preload} />
          <div className="container">
            <BreadCrumbs items={this.getBreadCrumbs()} symbol=">"/>
            <h1 className="primary-title">{`דיווח מקלט ${shelterReport.Address}`}</h1>
            <div className="flex-container" style={{flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
              <TextArea
                value={txt}
                placeholder="דוח המקלט"
                callBack={(id, param, val)=>this.setState({txt: val})}
              />
              <Button onClick={this.handleReport} style={{width: '20%', height:'40px', marginTop:'16px'}}><span>דווח</span></Button>
            </div>
          </div>
        </div>
      );
    }
    else
      return ( // employee not near shelter then try
        <div className="page">
          <Preload preload={preload} />
          <div style={{display: 'flex',alignItems:'center', justifyContent:'center',height:'100vh'}}>
            <Button onClick={this.handleCheckNearShelter} style={{width: '200px', height:'40px'}}><span>בדוק שוב</span></Button>
          </div>
        </div>
      )
  }
}
 