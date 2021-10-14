import React from 'react';
import Preload from '../Components/Preload/Preload';
import Button from '../Components/Button/Button';
import { ChoicePoint, MapTools } from '../Components/Map/Map';
import Modal from '../Components/Modal';
import Input from '../Components/Inputs/Input';
import BreadCrumbs from '../Components/BreadCrumbs/BreadCrumbs';
import { ShelterTools } from '../ShelterTools';


export default class SheltersAdmin extends React.Component {
  state = {
    items:[],
    preload: true,
    filter:'',
    mapToggle: null,
    contactToggle: null
  }
  componentDidMount=()=>{
    this.getItems();
  }
  getItems=()=>{
    this.props.post("ShelterData", "getItemsAdmin", null)
    .then((data)=>{
      if(data.Data)
        this.setState({items:data.Data, preload:false});
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
  handleAddItem=()=>{
    this.setState({preload: true})
    this.props.post("ShelterData", "insertItem", null)
    .then((data)=>{
      if(data.Data)
        this.setState({items:[data.Data, ...this.state.items], preload:false});
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
  handleUpdatePoint = async (id,mapObj)=>{
    this.setState({preload: true})
    const addresses = await MapTools.getAddress(mapObj.lat,mapObj.lng)
    this.props.post("ShelterData", "updatePoint", {
      id:id,
      lat: mapObj.lat,
      lon: mapObj.lng,
      address: addresses && addresses.results.length ? addresses.results[0].formatted_address : null
    })
    .then((data)=>{
      if(data.Data){
        const items = this.state.items.filter(x=>x.Id!==id);
        this.setState({items: [data.Data, ...items], preload:false, mapToggle: null});
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
  handleSetContact=(shelterId, contact)=>{
    if(!contact.name || !contact.name.length || !contact.phone || !contact.phone.length){
      this.props.alert("פרטים חסרים", "אחד הפרטים ריקים", "warning");
      return;
    }
    this.setState({preload: true})
    this.props.post("ShelterData", "setContact", {
      id: shelterId,
      name: contact.name,
      phone: contact.phone
    })
    .then((data)=>{
      if(data.Data)
        this.setState({items:[data.Data, ...this.state.items], contactToggle:null, preload:false});
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
  filterItems=()=>{
    const { filter, items } = this.state;
    if(filter.length)
      return items.filter(x=>x.Address && x.Address.includes(filter));
    return items;
  }
  renderChoicePoint=()=>{
    const { mapToggle } = this.state;
    return (
      <Modal close={()=>this.setState({mapToggle: null})} width={'60%'}> 
        <ChoicePoint 
          id={mapToggle.Id} 
          center={(mapToggle.Lat && mapToggle.Lon) ? { lat: parseFloat(mapToggle.Lat) ,lng: parseFloat(mapToggle.Lon) } : null} 
          callBack={this.handleUpdatePoint}
        /> 
      </Modal> 
    )
  }
  renderSetContact=()=>{
    const { contactToggle } = this.state;
    return (
      <Modal close={()=>this.setState({contactToggle: null})} width={'300px'}> 
        <div style={{padding:16, backgroundColor:'#fff'}}>
          <SetContact 
            id={contactToggle.Id} 
            name={contactToggle.ContactName} 
            phone={contactToggle.ContactPhone}
            callback={(id, e)=>this.handleSetContact(id, e)}
          />
        </div>
      </Modal> 
    )
  }
  render() { 
    const { REACT_APP_IMG_PATH } = process.env;
    const { preload, filter, mapToggle, contactToggle } = this.state;
    const { history } = this.props;
    return (
      <div className="page">
        <Preload preload={preload}/>
        {mapToggle ? this.renderChoicePoint() : null}
        {contactToggle ? this.renderSetContact() : null}
        <div className="container">
          <BreadCrumbs items={[{title:'עובדים', to:'/employee'}, {title:'ניהול מקלטים', to:'#'}]} symbol=">"/>
          <h1 className="primary-title">ניהול מקלטים</h1>
          <div className="flex-container" style={{margin:'16px', alignItems:'flex-end'}}>
            <div className="col-lg-1_5">
              <Button onClick={this.handleAddItem} style={{padding: '16px 8px'}}>
                <span>הוסף מקלט</span>
              </Button>
            </div>
            <div className="col-lg-5">
              <input
                className="input"
                placeholder="סנן לפי כתובת"
                value={filter}
                onChange={e=> this.setState({filter:e.target.value})}
                style={{border: 'none', borderBottom: '1px solid #ddd'}}
              />
            </div>
          </div>
          <ul className="list-view"> { /* List  Items*/ }
            <li className="sticky row header flex-container">
              <div className="field icon col-lg-1">
                <label>למקלט</label>
              </div>
              <div className="field icon col-lg-1">
                <label>מפה</label>
              </div>
              <div className="field col-lg-5">
                <label>כתובת</label>
              </div>
              <div className="field icon col-lg-1">
                <label>שיפוצים</label>
              </div>
              <div className="field icon col-lg-1">
                <label>ביקורות</label>
              </div>
              <div className="field icon col-lg-2">
                <label>סטטוס</label>
              </div>
              <div className="field icon col-lg-1">
                <label>איש קשר</label>
              </div>
            </li>
            {this.filterItems().map((el,i)=>{
              const status=ShelterTools.getStatus(el.Inspections, el.ShelterWorks, el.UseShelter)
              return(
                <li key={i} className="row flex-container">
                  <div className="field icon col-lg-1" onClick={()=>history.push('/employee/shelter/'+el.Id)}>
                    <img src={`${REACT_APP_IMG_PATH}/icons/admin/enter.svg`} alt="login"/>
                  </div>
                  <div className="field icon col-lg-1" onClick={()=>this.setState({mapToggle: el})}>
                    <img src={`${REACT_APP_IMG_PATH}/icons/admin/gps.svg`} alt="login"/>
                  </div>
                  <div className="field col-lg-5">
                    <label>{el.Address}</label>
                  </div>
                  <div className="field icon col-lg-1" onClick={()=>history.push('/employee/shelter-work/'+el.Id)}>
                    <img src={`${REACT_APP_IMG_PATH}/icons/admin/enter.svg`} alt="" />
                  </div>
                  <div className="field icon col-lg-1" onClick={()=>history.push('/employee/inspections-admin/'+el.Id)}>
                    <img src={`${REACT_APP_IMG_PATH}/icons/admin/enter.svg`} alt="" />
                  </div>
                  <div className="field icon col-lg-2" style={{backgroundColor:status.ColorCode, padding:'8px 0'}}>
                    <label style={{color:'#fff', fontSize:14, fontWeight:400}}>{status.Title}</label>
                  </div>
                  <div className="field icon col-lg-1" onClick={()=>this.setState({contactToggle: el})}>
                    <img src={`${REACT_APP_IMG_PATH}/icons/contact.png`} alt=""/>
                  </div>
                </li>
              )
            })}
          </ul>

        </div>
      </div>
    );
  }
}

function SetContact({id, name, phone, callback}){
  const [ obj, setObj] = React.useState({name: name, phone: phone});
  const handleSetObj=(param, value)=>{
    obj[param]=value;
    setObj(obj);
  }
  return(
    <div className="inputs-items">
      <div className="input-itam">
        <label>שם איש קשר</label>
        <Input 
          id={id}
          value={obj.name}
          param='name'
          placeholder="אם איש קשר"
          callBack={(id, param, val)=>handleSetObj(param, val)}
        />
      </div>
      <div className="input-itam">
        <label>טלפון איש קשר</label>
        <Input 
          id={id}
          value={obj.phone}
          param='phone'
          placeholder="טלפון איש קשר"
          callBack={(id, param, val)=>handleSetObj(param, val)}
        />
      </div>
      <div className="input-itam">
        <Button onClick={()=>callback(id, obj)}>
          <span>שמור</span>
        </Button>
        </div>
    </div>
  )
}