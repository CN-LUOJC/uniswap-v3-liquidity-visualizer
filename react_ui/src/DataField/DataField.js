import React from 'react';
import './DataField.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../logo.svg';
//import 'bootstrap/dist/js/bootstrap.min.js'; //import 'jquery/dist/jquery.min.js';



function DataField(props){

console.log(props.state)
if(props.state === "loading"){ 
  return(
    <div id="data_container">
    <img src={logo} width={200} className="App-logo" alt="logo" />
           
    </div>
    )
  }

else if (props.state === "data")
return(
  <div id="data_container">
   <table className="table">
   <thead>
   <tr>
    
    <th key="tt">Lower tick</th>
    <th key="t">Upper tick</th>
    <th key="liq">Liquidity</th>
    
   </tr>

  </thead>
  <tbody>
   {props.data.map((rows) => {
    return (
     <tr >
      
       <td key="tickLower">{rows["tickLower"]}</td>
       <td key="tickUpper">{rows["tickUpper"]}</td>
       <td key="liquidity">{rows["liquidity"]}</td>
     
     </tr>
    );
   })}
  </tbody>
    
    
   </table>
  </div>
)
else
  return(<div id="data_container"></div>)
}
export default DataField;