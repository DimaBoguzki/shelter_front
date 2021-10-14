import React from 'react';

/**
 * 
 * @param { Array } data array of obkect data to display
 * @param { String } className class style
 * @returns jsx table
 */

export default function Header({data, className}){
  React.useEffect(()=>{
    if(!Array.isArray(data) )
      console.error("data must bt array");
    else if(data.length == 0)
      console.error("data is empty");
  }, [])
  return(
    <table className={className ? className : "table-view"}>
      <thead>
        <tr>
          {data.length > 0 ? Object.keys(data[0]).map((f,i)=><th key={i}>{f}</th>) : null}
        </tr>
      </thead>
      <tbody>
        {data.map((b,i)=>(
          <tr key={i}>
            {Object.keys(b).map(((f,j)=><th key={j}>{b[f]}</th>))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}