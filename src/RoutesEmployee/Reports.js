import React from 'react'
import Table from '../Components/Table/Table';
import PageTwoHalves, { Half } from '../Components/PageTwoHalves/PageTwoHalves';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import Tabs, { Tab } from '../Components/Tabs/Tabs';
import Preload from '../Components/Preload/Preload';

export default class Reports extends React.Component {
  state={
    items:[],
    tab: 1,
    preload: false,
  }
  componentDidMount(){
    this.getItems(1);
  }
  getItems=(tab)=>{
    this.setState({preload: true});
    const func=tab===1 ? 'getCostPerShelter' : 'getLastSearch';
    this.props.post("ReportData", func, null)
    .then((response)=>{
      if(response.Data)
        this.setState({items: response.Data, preload:false, tab:tab});
      else
        this.props.alert("שגיאה", response.Error,"error");
    })
    .catch((err)=>{
      console.log(err);
    })
  }
  handleChangeTab=(tabId)=>{
    this.getItems(tabId)
  }
  render() { 
    const { items, tab, preload } = this.state;
    return (
      <div className="page">
        <Preload preload={preload}/>
        <PageTwoHalves>
          <Half>
            <Tabs callback={this.handleChangeTab} activeId={tab}>
              <Tab key={1} id={1} value="עלויות שיפוצים"/>
              <Tab key={2} id={2} value="כמות חיפושים אחרונים"/>
            </Tabs>
            <Table data={items} />
          </Half>
          <Half>
            {tab===1 ? 
            <BarChartData dataKeyX="מקלט" dataKeyBar='עלות' items={items}/> : 
            tab===2 ?<BarChartData dataKeyX="תאריך" dataKeyBar='כמות' items={items}/> : null}
          </Half>
        </PageTwoHalves>
      </div>
    );
  }
}





function BarChartData({dataKeyX, dataKeyBar, items}){
  return(
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={items}>
        <XAxis dataKey={dataKeyX ? dataKeyX : null} tickFormatter={(e)=> e} />
        <YAxis  allowDecimals={false}/>
        <Tooltip labelFormatter={(e)=>e} />
        <Bar dataKey={dataKeyBar ? dataKeyBar : 'x'} fill="rgba(106, 110, 229)" />
      </BarChart>
    </ResponsiveContainer>
  )
}
