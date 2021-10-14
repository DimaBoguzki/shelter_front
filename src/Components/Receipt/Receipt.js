import React from 'react';

export class Receipt extends React.Component{
  render(){
    const { order }=this.props
    return(
      <div className="receipt-d" id="print-receipt">
        <div className="lists flex-container">
          <ul className="col-lg-5">
            <li className="logo-r"><img src={globalFileServer+"logos/site-logo.svg"} alt=""/></li>
            <li><label>משתלת שלומית, החקלאים 15 כפר ביאליק</label></li>
            <li><label>e-mail: shlomit.nursery@gmail.com</label></li>
            <li><label>טלפון: 04-8710090, 04-8719728</label></li>
          </ul>
        </div>
        <div className="lists flex-container">
          <ul className="col-lg-4">
            <li><label style={{fontSize:16,fontWeight:600}}> מבצע הזמנה: </label><label>{(order.FirstName ? order.FirstName : '')+" "+(order.LastName ? order.LastName : '')}</label></li>
            <li><label style={{fontSize:16,fontWeight:600}}> טלפון מבצע הזמנה: </label><label>{order.Mobile}</label></li>
          </ul>
          <ul className="col-lg-4">
            <li><label>כתובת למשלוח</label></li>
            <li><label>{order.Street+" "+order.StreetNumber+(order.Apartment ? "/"+order.Apartment : '')}</label></li>
            <li><label>{order.Floor ? "קומה "+order.Floor: ''}</label></li>
            <li><label>{order.Town}</label></li>
            <li><label>{" טלפון "+order.PhoneRecipient ? order.PhoneRecipient : order.Mobile}</label></li>
            <li><label>{order.PhoneRecipient ? (" טלפון נוסף "+order.Mobile) : ''}</label></li>
          </ul>
          <ul className="col-lg-4">
            <li><label>{" תאריך הזמנה "+order.Date}</label></li>
            {order.DateRecipient ? 
            <li><label>{" תאריך משלוח הזמנה  "+order.DateRecipient }</label></li> : null}
          </ul>
        </div>
        <div className="flex-container">
          <ul style={{margin:'16px 0'}}>
            <li><label style={{fontSize:16,fontWeight:600}}> מקבל ההזמנה </label><label>{order.NameRecipient}</label></li>
            <li><label style={{fontSize:16,fontWeight:600}}> טלפון מקבל הזמנה: </label><label>{order.PhoneRecipient}</label></li>
            <li><label style={{fontSize:16,fontWeight:600}}> תאריך לביוצוע הזמנה: </label><label>{order.DateRecipient}</label></li>
          </ul>
        </div>
        <h3>{'אישור הזמנה מספר : '+order.Id}</h3>
        <table style={{margin:'0 auto'}}>
          <tbody>
            <tr>
              <th>שורה</th>
              <th>מק"ט</th>
              <th>תאור מוצר</th>
              <th>כמות</th>
              <th>מחיר</th>
              <th>הנחה</th>
              <th>סה"כ מחיר</th>
              <th>מתנה?</th>
            </tr>
            {order.HistoryDetaileds.map((x,i)=>{
              return (
                <tr key={i}>
                  <td>{i+1}</td>
                  <td>{x.Barcode}</td>
                  <td>{x.ProdName + ((x.Colors && x.Colors.Id!=0) ? " "+x.Colors.Name : ' ')}</td>
                  <td>{x.Quantity}</td>
                  <td>{(parseFloat(x.SinglePrice) + (x.Discount ? parseFloat(x.Discount) : 0))}</td>
                  <td>{x.Discount ? parseFloat(x.Discount) : ''}</td>
                  <td>{( parseInt(x.Quantity)*parseFloat(x.SinglePrice) )}</td>
                  <td>{x.IsGift ? "כן":"לא"}</td>
                </tr>
              )
            })}
          </tbody>
        </table> 
        <div className="lists flex-container">
          <ul className="col-lg-5">
            <li><label style={{fontSize:14,fontWeight:500}}>הערות למשלוח</label></li>
            <li><label>{order.Comment}</label></li>
          </ul>
          <ul className="col-lg-5 price">
            {order.DeliveryPrice ?
            <li><label>מחיר משלוח</label><label style={{fontWeight:600}}>{parseFloat(order.DeliveryPrice)}</label></li> : null}
            <li><label>סה"כ מחיר</label><label style={{fontWeight:600}}>{parseFloat(order.Price)}</label></li>
          </ul>
        </div>
        {order.Letter ? <div className="letter">
          <label style={{fontSize:14,fontWeight:500}}>ברכה</label>
          <pre>{order.Letter.replace(/n/g,'\n')}</pre>
        </div> : null}
      </div>
    )
  }
}

export class EmployeeReceipt extends React.Component{
  render(){
    const { order }=this.props;
    const dateRecipient=order.DateRecipient ? order.DateRecipient.split(" ")[0] : null
    return(
      <div className="receipt-d" id="print-receipt">
        <div className="lists flex-container">
          <ul className="col-lg-5">
            <li className="logo-r"><img src={globalFileServer+"logos/site-logo.svg"} alt=""/></li>
          </ul>
        </div>
        <div className="lists flex-container">
          <ul className="col-lg-4">
            <li><label className="title" style={{fontSize:20}}>איש קשר</label></li>
            <li><label className="title"> מקבל ההזמנה </label><label>{order.NameRecipient}</label></li>
            <li><label className="title"> טלפון מקבל הזמנה: </label><label>{order.PhoneRecipient}</label></li>
            {/* {order.Mobile ?
            <li><label className="title"> טלפון נוסף: </label><label>{order.Mobile}</label></li> : null}
            {order.Tel ?
            <li><label className="title"> טלפון נוסף: </label><label>{order.Tel}</label></li> : null} */}
          </ul>
          <ul className="col-lg-4">
            <li><label className="title" style={{fontSize:20}}>כתובת למשלוח</label></li>
            <li><label className="title"> רחוב: </label><label>{order.Street ? order.Street : ''}</label></li>
            <li><label className="title"> מספר בית: </label><label>{order.StreetNumber ? order.StreetNumber : ''}</label></li>
            <li><label className="title"> מספר דירה: </label><label>{order.Apartment ? order.Apartment : ''}</label></li>
            <li><label className="title"> קומה: </label><label>{order.Floor ? "קומה "+order.Floor: ''}</label></li>
            <li><label className="title"> ישוב: </label><label>{order.Town}</label></li>
          </ul>
          <ul className="col-lg-4">
            <li><label className="title"> תאריך יצירת הזמנה: </label><label>{order.Date}</label></li>
            {dateRecipient ? 
              <li><label className="title"> תאריך למשלוח: </label><label>{dateRecipient}</label></li> : null}
          </ul>
        </div>
        <div className="lists flex-container">
          <ul className="col-lg-3">
            <li><label className="title"> שם מזמין: </label><label>{order.FirstName+" "+(order.LastName ? order.LastName : '')}</label></li>
            {order.Mobile ?
            <li><label className="title"> טלפון מבצע הזמנה:  </label><label>{order.Mobile}</label></li> : null}
            {order.Tel ?
            <li><label className="title"> טלפון מבצע הזמנה:  </label><label>{order.Tel}</label></li> : null}
          </ul>
          <ul className="col-lg-3">
            <li><label className="title" style={{fontSize:20}}>שם עובד</label></li>
            <li><div className="employee-input"/></li>
          </ul>
          <ul className="col-lg-3">
            <li><label className="title" style={{fontSize:20}}>מספר ארגזים</label></li>
            <li><div className="employee-input"/></li>
          </ul>
          <ul className="col-lg-3">
            <li><label className="title" style={{fontSize:20}}>שקים</label></li>
            <li><div className="employee-input"/></li>
          </ul>
        </div>
        <div className="lists flex-container">
          <ul className="col-lg-3">
            <li><label className="title" style={{fontWeight:500}}>הערות למשלוח</label></li>
            <li><label style={{margin:'8px 0'}}>{order.Comment ? order.Comment : 'אין'}</label></li>
            <li><label className="title"> מחיר משלוח: </label><label>{order.DeliveryPrice ? parseFloat(order.DeliveryPrice)+' ש"ח ' : 0 }</label></li>
            <li><label className="title"> סה"כ: </label><label>{parseFloat(order.Price).toFixed(1)+' ש"ח '}</label></li>
          </ul>
        </div>
        <h3>{'אישור הזמנה מספר : '+order.Id}</h3>
        <table style={{margin:'32px auto'}}>
          <tbody>
            <tr>
              <th>שורה</th>
              <th>מק"ט</th>
              <th>תאור מוצר</th>
              <th>כמות</th>
              <th>מחיר</th>
              <th>הנחה</th>
              <th>סה"כ מחיר</th>
              <th>מתנה?</th>
            </tr>
            {order.HistoryDetaileds.map((x,i)=>{
              return (
                <tr key={i}>
                  <td>{i+1}</td>
                  <td>{x.Barcode}</td>
                  <td>{x.ProdName + ((x.Colors && x.Colors.Id!=0) ? " "+x.Colors.Name : ' ')}</td>
                  <td>{x.Quantity}</td>
                  <td>{(parseFloat(x.SinglePrice) + (x.Discount ? parseFloat(x.Discount) : 0))}</td>
                  <td>{x.Discount ? parseFloat(x.Discount) : 0}</td>
                  <td>{( parseInt(x.Quantity)*parseFloat(x.SinglePrice) )}</td>
                  <td>{x.IsGift ? "כן":"לא"}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {order.Letter ? <div className="letter">
          <label>ברכה</label>
          <pre>{order.Letter.replace(/n/g,'\n')}</pre>
        </div> : null}
        <div className="num-order-duplicate">
          <h2>{'הזמנה : '+order.Id}</h2>
          <h2>{'הזמנה : '+order.Id}</h2>
        </div>
      </div>
    )
  }
}
