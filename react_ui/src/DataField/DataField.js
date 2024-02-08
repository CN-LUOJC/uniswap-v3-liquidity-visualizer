import React from 'react';
import './DataField.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../logo.svg';
//import 'bootstrap/dist/js/bootstrap.min.js'; //import 'jquery/dist/jquery.min.js';


function DataField(props){

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
                    <th key="Pa_h">Lower price</th>
                    <th key="Pb_h">Upper price</th>
                    <th key="liq">Liquidity</th>
                </tr>
            </thead>
          
            <tbody>
              {props.data.map((rows) => {
              return(
                <tr>
                    <td >{rows["tickLower"]}</td>
                    <td >{rows["tickUpper"]}</td>
                    <td >{1/rows["Pa"]}</td>
                    <td >{1/rows["Pb"]}</td>
                    <td >{rows["liquidity"]}</td>
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