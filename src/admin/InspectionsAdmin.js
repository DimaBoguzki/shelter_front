import React from 'react';
import Modal from '../Components/Modal';
import Preload from '../Components/Preload/Preload';
import CheckBox from '../Components/Inputs/CheckBox';
import BreadCrumbs from '../Components/BreadCrumbs/BreadCrumbs';
import { Link } from 'react-router-dom';

export default class Inspections extends React.Component {
  state = { 
    items: [],
    shelter:null,
    preload: true,
    reportToggle: null
  }
  componentDidMount=()=>{
    this.getItems();
  }
  getItems=()=>{
    this.props.post("InspectionData", "getItemsByShelterID", {
      shelterId:this.props.match.params.id
    })
    .then((data)=>{
      if(data.Data)
        this.setState({items:data.Data.Inspections,shelter:data.Data.Shelter, preload:false});
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
  handleAcceptInspection=(id,val)=>{
    this.setState({preload: true})
    this.props.post("InspectionData", "updateItem", {
      id: id,
      param: 'IsValid',
      value: val
    })
    .then((data)=>{
      if(data.Data){
        this.state.items.find(x=>x.Id===id).IsValid=val;
        this.setState({items:[...this.state.items], preload:false});
      }
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
  render() { 
    const { preload, items, reportToggle, shelter } = this.state;
    const { REACT_APP_IMG_PATH } = process.env;
    return ( 
      <div className="page">
        <Preload preload={preload}/>
        {reportToggle ?<Modal close={()=>this.setState({reportToggle: null})} width={'300px'}> 
            <div className="report">
              <h2>{"דוח"}</h2>
              <p>{reportToggle.Report}</p>
            </div>
          </Modal> 
        : null}
        {shelter ? 
        <div className="container">
          <BreadCrumbs items={[
            {title:'עובדים', to:'/employee'},
            {title:'ניהול מקלטים', to:'/employee/shelters-admin'},
            {title:'ביקורת מקלט', to:'#'}]} symbol=">"
          />
          <h1 className="primary-title">{shelter.Address}</h1>
          <div style={{marginBottom:'32px'}}>
            <Link to={{pathname: '/employee/inspection-shelter', state: { shelter: shelter}}} className="button" style={{padding: '16px 8px'}}>
              <span>הוסף ביקורת</span>
            </Link>
          </div>
          <ul className="list-view"> { /* Header List */ }
            <li className="row header flex-container">
              <div className="field col-lg-3">
                <label>תאריך</label>
              </div>
              <div className="field col-lg-2">
                <label>מבקר</label>
              </div>
              <div className="field col-lg-1">
                <label>דוח</label>
              </div>
              <div className="field col-lg-1">
                <label>אישור</label>
              </div>
            </li>
          </ul>
          <ul className="list-view"> { /* List  Items*/ }
            {items.map((el,i)=>{
              return(
                <li key={i} className="row flex-container" style={{cursor:'pointer'}}>
                  <div className="field col-lg-3">
                    <label>{el.Date+" : "+el.Time}</label>
                  </div>
                  <div className="field col-lg-2">
                  <label>{el.Auditer.Name}</label>
                  </div>
                  <div className="field col-lg-1" onClick={()=>this.setState({reportToggle: el})}>
                    <img src={`${REACT_APP_IMG_PATH}/icons/report.png`} alt=""/>
                  </div>
                  <div className="field col-lg-1">
                    <CheckBox 
                      id={el.Id}
                      value={el.IsValid}
                      callback={(val, id, paramName)=>this.handleAcceptInspection(id,val)}
                      big={true}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </div> : null}
      </div>
    );
  }
}
 