import React  from 'react';
import './DataField.css';
import AddForm from './AddForm/AddForm';
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

else if (props.state === "show_data")
  return(
    <div id="data_container">
        <table className="table">
            <thead>
                <tr>
                
                <th key="Pa_h">Lower price</th>
                <th key="Pb_h">Upper price</th>
                <th key="tt">Lower tick</th>
                <th key="t">Upper tick</th>
                    
                    
                    <th key="liq">Liquidity</th>
                    <th>Options</th>
                </tr>
            </thead>
          
            <tbody>
              {props.data.map((rows,i) => {
              return(
                <tr class={rows["show"]? null:'greyed'} >
                    <td >{1/rows["Pb"]}</td>
                    <td >{1/rows["Pa"]}</td>
                    <td >{rows["tickLower"]}</td>
                    <td >{rows["tickUpper"]}</td>
                    <td >{rows["liquidity"]}</td>
                    <td ><span> <a href="#" onClick={() => props.toggleShow(i)}>{rows["show"] ? "Hide":"Show"}</a>&nbsp;    
                      {!rows["fixed"] ? <a href="#" onClick={() => props.delPos(i)}>Del</a>:null}</span></td>
                </tr>
              );
              })}
             <AddForm addPos = {props.addPos}/>
            </tbody>
        </table>
    </div>
  )
  else
    return(<div id="data_container"></div>)
}


export default DataField;