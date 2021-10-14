import React from 'react';
import Preload from '../Components/Preload/Preload';
import Button from '../Components/Button/Button';
import Input from '../Components/Inputs/Input';
import According from '../Components/According/According';
import Modal from '../Components/Modal';

function SetUser({callback, alert}){
  const [ obj, setObj] = React.useState({name: '',mail:'',  phone: '', password:''});
  const handleSetObj=(param, value)=>{
    obj[param]=value;
    setObj(obj);
  }
  const handleSave=()=>{
    for (const key in obj) {
      if(!obj[key].length){
        alert('פרטים חסרים ',`ב ${key}`, 'warning');
        return 
      }
    }
    callback(obj);
  }
  return(
    <div className="inputs-items">
      <div className="input-itam">
        <label>שם מלא</label>
        <Input 
          value={obj.name}
          param='name'
          placeholder="שם מלא"
          callBack={(id, param, val)=>handleSetObj(param, val)}
        />
      </div>
      <div className="input-itam">
        <label>מייל</label>
        <Input 
          value={obj.mail}
          param='mail'
          placeholder="מייל"
          callBack={(id, param, val)=>handleSetObj(param, val)}
        />
      </div>
      <div className="input-itam">
        <label>טלפון</label>
        <Input 
          value={obj.phone}
          param='phone'
          placeholder="טלפון"
          callBack={(id, param, val)=>handleSetObj(param, val)}
        />
      </div>
      <div className="input-itam">
        <label>סיסמא</label>
        <Input 
          value={obj.password}
          param='password'
          placeholder="סיסמא"
          callBack={(id, param, val)=>handleSetObj(param, val)}
        />
      </div>
      <div className="input-itam">
        <Button onClick={handleSave}>
          <span>שמור</span>
        </Button>
        </div>
    </div>
  )
}

const EditUser=React.memo(({user, updateUser, roles})=>{
  const rednerHeaderUser=()=>{
    return (
      <li className="row flex-container">
        <div className="field" style={{width:'36%'}}>
          <label>{user.Name}</label>
        </div>
        <div className="field" style={{width:'36.5%'}}>
          <label>{user.Mail}</label>
        </div>
        <div className="field">
        <label>{user.Phone}</label>
        </div>
      </li>
    )
  }
  return (
    <According jsxHeader={rednerHeaderUser()}>
      <div className="user-edit">
        <div className="flex-container edit-item">
          <label>שם</label>
          <Input 
            id={user.Id}
            value={user.Name ? user.Name : ''}
            param="Name"
            placeholder="שם"
            callBack={(id,param,value)=>updateUser(id,param,value)}
          />
        </div>
        <div className="flex-container edit-item">
          <label>מייל</label>
          <Input
            id={user.Id}
            value={user.Mail ? user.Mail : ''}
            param="Mail"
            placeholder="מייל"
            callBack={(id,param,value)=>updateUser(id,param,value)}
          />
        </div>
        <div className="flex-container edit-item">
          <label>טלפון</label>
          <Input
            id={user.Id}
            value={user.Phone ? user.Phone : ''}
            param="Phone"
            placeholder="טלפון"
            callBack={(id,param,value)=>updateUser(id,param,value)}
          />
        </div>
        <div className="flex-container edit-item">
          <label>סיסמא</label>
          <Input
            id={user.Id}
            value={user.Password ? user.Password : ''}
            param="Password"
            placeholder="סיסמא"
            callBack={(id,param,value)=>updateUser(id,param,value)}
          />
        </div>
        <div className="flex-container edit-item">
          <label>הרשאות</label>
          <select onChange={(e)=>updateUser(user.Id,'RoleId', e.target.value)} value={user.RoleId}>
            {roles.map(r=><option key={r.Id} value={r.Id} >{r.Type}</option>)}
          </select>
        </div>
      </div>
    </According>
  )
},(prevProps,nextProps)=> ( 
    (prevProps.user.Name===nextProps.user.Name) &&
    (prevProps.user.Mail===nextProps.user.Mail) &&
    (prevProps.user.Phone===nextProps.user.Phone) &&
    (prevProps.user.Password===nextProps.user.Password) &&
    (prevProps.user.Auditers === nextProps.user.Auditers) && 
    (prevProps.user.RoleId === nextProps.user.RoleId) 
  )
);
export default class UsersAdmin extends React.Component {
  state = { 
    users:[],
    roles:[],
    preload: true,
    filter:'',
    newUserToggle: false
  }
  componentDidMount=()=>{
    this.getItems();
  }
  getItems=()=>{
    this.props.post("UserData", "getItemsAdmin", null)
    .then((data)=>{
      if(data.Data)
        this.setState({users:data.Data.Users, roles:data.Data.Roles, preload:false});
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
  handleAddUser=(newUser)=>{
    this.setState({preload: true})
    this.props.post("UserData", "insertItem", {
      user: newUser
    })
    .then((data)=>{
      if(data.Data){
        const { users } = this.state
        users.unshift(data.Data);
        this.setState({users:users, preload:false, newUserToggle:false});
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
  updateUser=(id, param, value)=>{
    const user=this.state.users.find(x=>x.Id+''===id+'');
    if(user && user[param]+''===value+'')
      return
    this.setState({preload: true})
    this.props.post("UserData", "updateItem", {
      id:id,
      field: param,
      value: value
    })
    .then((data)=>{
      if(data.Data){
        const { users } = this.state;
        this.setState({users: users.map(user => user.Id===id ? data.Data : user), preload: false});
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
  filterItems=()=>{
    const { filter, users } = this.state;
    if(filter.length)
      return users.filter(x=>(x.Name && x.Name.includes(filter)) || (x.Mail && x.Mail.includes(filter)) || (x.Phone && x.Phone.includes(filter)));
    return users;
  }
  renderCreateUser=()=>{
    return (
      <Modal close={()=>this.setState({newUserToggle: false})} width={'300px'}> 
        <div style={{padding:16, backgroundColor:'#fff'}}>
          <SetUser callback={(e)=>this.handleAddUser(e)} alert={this.props.alert}/>
        </div>
      </Modal> 
    )
  }
  render() { 
    const { preload, filter, newUserToggle, roles } = this.state;
    return (
      <div className="page">
        <Preload preload={preload}/>
        {newUserToggle ? this.renderCreateUser() : null}
        <div className="container">
          <h1 className="primary-title">ניהול משתמשים</h1>
          <div className="flex-container" style={{margin:'16px', alignItems:'flex-end'}}>
            <div className="col-lg-1_5">
              <Button onClick={()=>this.setState({newUserToggle: true})} style={{padding: '16px 8px'}}>
                <span>צור משתמש</span>
              </Button>
            </div>
            <div className="col-lg-5">
              <input
                className="input"
                placeholder="סנן לפי שם או מייל או טלפון"
                value={filter}
                onChange={e=> this.setState({filter:e.target.value})}
                style={{border: 'none', borderBottom: '1px solid #ddd'}}
              />
            </div>
          </div>
          <ul className="list-view"> { /* Header List */ }
            <li className="row header flex-container">
              <div className="field col-lg-1">
                <label>פתח</label>
              </div>
              <div className="field col-lg-4">
                <label>שם</label>
              </div>
              <div className="field col-lg-4">
                <label>מייל</label>
              </div>
              <div className="field col-lg-3">
                <label>טלפון</label>
              </div>
            </li>
          </ul>
          <ul className="list-view"> { /* List  Items*/ }
            {this.filterItems().map((el) => <EditUser key={el.Id+" editUser"} user={el} updateUser={this.updateUser} roles={roles}/>)}
          </ul>
        </div>
      </div>
    );
  }
}