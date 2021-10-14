import React from 'react';
import Preload from '../Components/Preload/Preload';
import BreadCrumbs from '../Components/BreadCrumbs/BreadCrumbs';
import Input from '../Components/Inputs/Input';
import TexstArea from '../Components/Inputs/TextArea';
import { ChoicePoint } from '../Components/Map/Map';


class Shelter extends React.Component {
  state = {
    shelter: null,
    useShelters:[],
    preload: true
  }
  componentDidMount=()=>{
    this.getShelter();
  }
  getShelter=()=>{
    this.props.post("ShelterData", "getItemByIdAdmin", {
      id: this.props.match.params.id
    })
    .then((data)=>{
      console.log(data);
      if(data.Data)
        this.setState({shelter:data.Data.Shelter,useShelters:data.Data.UseShelters, preload:false});
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
  updateShelter=(id, param, value)=>{
    const { shelter } = this.state;
    if(shelter[param]+''===value+'')
      return;
    this.setState({preload:true})
    this.props.post("ShelterData", "updateItem", {
      id:id,
      field: param,
      value: value
    })
    .then((data)=>{
      if(data.Data){
        shelter[param]=value;
        this.setState({shelter: shelter, preload: false});
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
  handleUpdateUseShelter=(useShelter)=>{
    if(useShelter)
      this.updateShelter(this.state.shelter.Id, 'useShelter', useShelter.Title);
  }
  render() { 
    const { preload, shelter, useShelters } = this.state;
    return (
      <div className="page">
        <Preload preload={preload} />
        {shelter ? 
        <div className="container">
          <BreadCrumbs items={[
            {title:'עובדים', to:'/employee'}, 
            {title:'ניהול מקלטים', to:'/employee/shelters-admin'},
            {title: shelter.Address, to:'#'},]} symbol=">"
          />
          <h1 className="primary-title">{shelter.Address}</h1>
          <div className="edit-item-admin">
            <div className="content col-lg-6">
              <h2>איש קשר</h2>
              <label>שם איש קשר</label>
              <Input
                id={shelter.Id}
                value={shelter.ContactName}
                param="ContactName"
                callBack={this.updateShelter}
              />
              <label>טלפון איש קשר</label>
              <Input
                id={shelter.Id}
                value={shelter.ContactPhone}
                param="ContactPhone"
                type="number"
                callBack={this.updateShelter}
              />
            </div>
          </div>
          <div className="edit-item-admin">
            <div className="content" style={{width: '50%'}}>
              <h2>שימוש</h2>
              <select onChange={(e)=>this.updateShelter(shelter.Id,'UseShelterId', e.target.value)} value={shelter.UseShelterId}>
                {useShelters.map(s=><option key={s.Id} value={s.Id} >{s.Type}</option>)}
              </select>
            </div> 
          </div>
          <div className="edit-item-admin">
            <div className="content">
              <h2>הערה</h2>
              <TexstArea
                id={shelter.Id}
                value={shelter.Comment}
                param="Comment"
                type="number"
                style={{height: 200}}
                callBack={this.updateShelter}
              />
            </div>
          </div>
          <div className="edit-item-admin">
            <div className="content">
              <h2>מפה</h2>
              <ChoicePoint 
                id={shelter.Id} 
                center={(shelter.Lat && shelter.Lon) ? { lat: parseFloat(shelter.Lat) ,lng: parseFloat(shelter.Lon) } : null} 
                callBack={(a,b)=>console.log(a,b)}
              /> 
            </div>
          </div>
        </div> : null}
      </div>
    );
  }
}
 
export default Shelter;