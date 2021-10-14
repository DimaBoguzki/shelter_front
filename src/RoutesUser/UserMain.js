import React from 'react';
import Preload from '../Components/Preload/Preload';
import { SheltersMap, MapTools } from '../Components/Map/Map';


export default class UserMain extends React.Component {
  state = { 
    shelters:[],
    preload: false,
    radius: 100000
  }
  componentDidMount=()=>{}

  handleGetShelters=()=>{
    MapTools.getCurentPostion()
    .then((data)=>{
      console.log(data);
      MapTools.getAddress(data.latitude, data.longitude).then(d=>console.log(d)).catch(e=>console.log(e))
      this.setState({preload: true})
      this.getNearShelters({
        lat: data.latitude,
        lng: data.longitude
      },this.state.radius);
    })
    .catch((err)=>console.log(err))
  }
  getNearShelters=(curentPostion, radius)=>{
    this.props.post("ShelterData","getSheltersByRadius", {
      curentPostion: curentPostion,
      radius: radius
    })
    .then((data)=>{
      if(data.Data.length)
        this.setState({shelters:data.Data, preload: false})
        else{
          MapTools.getAddress(curentPostion.lat, curentPostion.lng)
          .then(d=>{
            console.log(d,"current")
            this.props.alert("לא נמצאו מקלטים","","warning")
          })
          this.setState({preload:false})
        }
    })
    .catch((err)=>{
      console.log(err);
    })
  }
  renderButton=()=>{
    return (
      <div className="push-button">
        <button onClick={this.handleGetShelters}>
          <label>לחצן</label>
          <label>מצוקה</label>
        </button>
      </div>
    )
  }
  render() { 
    const { shelters, preload } = this.state;
    return (
      <div className="page">
        <Preload preload={preload}/>
        <div className="container">
          {shelters.length ? <SheltersMap shelters={shelters} initialZoom={18}/> : this.renderButton()}
        </div>
      </div>
    );
  }
}