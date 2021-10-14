import React from 'react';
import Preload from '../Components/Preload/Preload';
import Modal from '../Components/Modal';
import Button from '../Components/Button/Button';
import TexstArea from '../Components/Inputs/TextArea';
import Input from '../Components/Inputs/Input';
import CheckBox from '../Components/Inputs/CheckBox';
import BreadCrumbs from '../Components/BreadCrumbs/BreadCrumbs';

export default class ShelterWorkAdmin extends React.Component {
  state = { 
    items:[],
    preload: true,
    reportToggle: null,
    filter:''
  }
  componentDidMount(){
    this.getItems();
  }
  getItems=()=>{
    this.props.post("WorkShelter", "getWorksByShelterId", {
      shelterId: this.props.match.params.id
    })
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
    this.props.post("WorkShelter", "insertItem", {
      shelterId: this.props.match.params.id
    })
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
  handleUpdateItem=(id, param, val)=>{
    this.setState({preload: true})
    this.props.post("WorkShelter", "updateItem", {
      id: id,
      field: param,
      value: val
    })
    .then((data)=>{
      if(data.Data){
        this.state.items.find(x=>x.Id===id)[param]=val;
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
    const { preload, items, reportToggle, filter } = this.state;
    const { REACT_APP_IMG_PATH } = process.env;
    return (
      <div className="page">
        <Preload preload={preload}/>
        {reportToggle ?
          <Modal close={()=>this.setState({reportToggle: null})} width={'450px'}> 
            <div className="report">
              <h2>{"דוח"}</h2>
              <TexstArea
                id={reportToggle.Id}
                value={reportToggle.ExecutionReport}
                param="ExecutionReport"
                style={{height: '500px'}}
                callBack={this.handleUpdateItem}
              />
            </div>
          </Modal> 
        : null}
        <div className="container">
          <BreadCrumbs items={[
            {title:'עובדים', to:'/employee'}, 
            {title:'ניהול מקלטים', to:'/employee/shelters-admin'},
            {title:'מקךטים שיפוצים', to:'#'},]} symbol=">"
          />
          <h1 className="primary-title">{items.length ? items[0].Shelter.Address : ''}</h1>
          <div className="flex-container" style={{padding:'16px', alignItems:'flex-end'}}>
            <div className="col-lg-1_5">
              <Button onClick={this.handleAddItem} style={{padding: '16px 8px'}}>
                <span>הוסף עבודה</span>
              </Button>
            </div>
            <div className="col-lg-5">
              <input
                className="input"
                placeholder="סנן לפי תאריך"
                value={filter}
                onChange={e=> this.setState({filter:e.target.value})}
                style={{border: 'none', borderBottom: '1px solid #ddd'}}
              />
            </div>
          </div>
          <ul className="list-view"> { /* Header List */ }
            <li className="row header flex-container">
              <div className="field col-lg-2">
                <label>תאריך</label>
              </div>
              <div className="field col-lg-6">
                <label>הערות</label>
              </div>
              <div className="field col-lg-2">
                <label>עלות</label>
              </div>
              <div className="field col-lg-1">
                <label>דוח</label>
              </div>
              <div className="field col-lg-1">
                <label>הושלם</label>
              </div>
            </li>
          </ul>
          <ul className="list-view"> { /* List  Items*/ }
            {items.map((el)=>{
              return(
                <li key={el.Id+"-work"} className="row flex-container" style={{cursor:'pointer'}}>
                  <div className="field col-lg-2">
                   <label>{el.Date}</label>
                  </div>
                  <div className="field col-lg-6">
                    <TexstArea
                      id={el.Id}
                      value={el.Comment}
                      param="Comment"
                      style={{height: '120px'}}
                      callBack={this.handleUpdateItem}
                    />
                  </div>
                  <div className="field col-lg-2">
                    <Input
                      id={el.Id}
                      type="number"
                      value={el.Cost}
                      param="Cost"
                      style={{width:'50%'}}
                      callBack={this.handleUpdateItem}
                    />
                  </div>
                  <div className="field col-lg-1" onClick={()=>this.setState({reportToggle:el})}>
                    <img src={`${REACT_APP_IMG_PATH}/icons/report.png`} alt=""/>
                  </div>
                  <div className="field col-lg-1">
                    <CheckBox 
                      id={el.Id}
                      value={el.IsComplete}
                      paramName="IsComplete"
                      callback={(val, id, paramName)=>this.handleUpdateItem(id, paramName, (val ? 1 : 0))}
                      big={true}
                    />
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