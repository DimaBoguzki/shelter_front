/* eslint-disable eqeqeq */
import React, { useState } from 'react';
import Button from '../Components/Button/Button';
import Input from '../Components/Inputs/Input';
import Preload from '../Components/Preload/Preload';
import userStorage from '../LocalStorage/userStorage';

export default function LoginEmployee(props){
  const [ login, setLogin ] = useState({email:'dimaboguzki@gmail.com', pass:''});
  const [ code, setCode ] = useState('');
  const [ codeToggle, setCodeToggle ] = useState(false);
  const [preload, setPreload]=useState(false);

  const { alert, post } = props;
  const { REACT_APP_IMG_PATH } = process.env;


  const handleLogin=()=>{
    setPreload(true);
    post("UserData", "getCode", { mail: login.email, password: login.pass})
    .then((res)=>{
      console.log(res);
      if(res.Data.Code!=null && res.Data.Code!=-1){
        setPreload(false);
        setCodeToggle(true);
        setTimeout(()=>{
          setCodeToggle(false);
        }, 100000);
      }
      else{
        setPreload(false);
        alert("שגיאה", res.Error, "error");
      }
    })
    .catch((err)=>{
      setPreload(false);
      alert("תקלה", "פנה לשירות לקוחות", "error");
      console.log(err);
    })
  }
  const handleCheckCode=()=>{
    setPreload(true);
    post("UserData", "checkCode", { email: login.email, pass: login.pass, code: code})
    .then((data)=>{
      setPreload(false);
      if(data.Data){
        userStorage.setUser(JSON.stringify(data.Data));
        alert("ברוך הבא",data.Data.Name,'success');
        props.history.push('/employee');
      }
      else{
        alert("שגיאה", data.Error, "error");
      }
    })
    .catch((err)=>{
      alert("תקלה", "פנה לשירות לקוחות", "error");
      console.log(err);
    })
  }
  const renderCode=()=>{
    return (
      <div>
        <div className="item col-lg-5">
          <Input
            value={code}
            placeholder="קוד"
            param="code"
            callBack={(id,param,val)=>setCode(val)}
          />
        </div>
        <div className="item col-lg-5">
          <Button onClick={handleCheckCode}>
            <span>שלח</span>
          </Button>
        </div> 
      </div>
    )
  }
  return (
    <div className="login page">
      <Preload preload={preload}/>
      <div className="wrrapper">
        <div className="inputs flex-container">
          <div className="item">
            <img src={`${REACT_APP_IMG_PATH}/assets/login.png`} alt="login"/>
          </div>
          {!codeToggle ? 
          <>
          <div className="item">
            <Input
              value={login.email}
              placeholder="מייל"
              param="email"
              callBack={(id, param, val)=>setLogin(login=>({...login, [param]: val}))}
            />
          </div>
          <div className="item">
            <Input
              value={login.email}
              placeholder="סיסמא"
              param="pass"
              callBack={(id, param, val)=>setLogin(login=>({...login, [param]: val}))}
              type={"password"}
            />
          </div>
          <div className="item">
            <Button onClick={handleLogin}>
              <span>התחבר</span>
            </Button>
          </div> 
          </> : renderCode() }
        </div>
      </div>
    </div>
  )
}