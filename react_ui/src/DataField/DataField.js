import React , { useState } from 'react';
import './DataField.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../logo.svg';
//import 'bootstrap/dist/js/bootstrap.min.js'; //import 'jquery/dist/jquery.min.js';

function sq(i){
  return Math.sqrt(i);
}

function DataField(props){

const addSubmit = () =>{
  let pa = 1/document.getElementById("Pa_i").value
  let pb = 1/document.getElementById("Pb_i").value
  let price = 1/document.getElementById("Pr_i").value
  let weth = document.getElementById("weth_i").value
  let tokens = document.getElementById("tokens_i").value
  
  let lx;
  let ly;
  let liq;
  
  if(price <=pa)
    liq = weth * sq(pa)*sq(pb)/(sq(pb)-sq(pa));
  else if(price >= pb)
    liq = tokens/(sq(pb)-sq(pa));
    
  else{
    lx = weth*sq(price)*sq(pb)/(sq(pb)-sq(price));
    ly = tokens/(sq(price)-sq(pa));
    liq = Math.min(lx,ly);
    }

  props.addPos(pa,pb,liq)
}
//active field in form
const [fieldAct,setfieldAct] = useState(0);

const priceForm = ()=>{
  let price = 1/document.getElementById("Pr_i").value;
  let pa = 1/document.getElementById("Pa_i").value;
  let pb = 1/document.getElementById("Pb_i").value;
  let weth = document.getElementById("weth_i").value;
  let tokens = document.getElementById("tokens_i").value;

  if(price && pa && pb){
    if(price >= pb)
      document.getElementById("weth_i").value = 0;
    else if(price <= pa)
      document.getElementById("tokens_i").value = 0;
    else if(fieldAct == "ETH")
    {
      
        let tokens = weth*sq(price)*sq(pb)*(sq(price)-sq(pa))/(sq(pb)-sq(price));
        document.getElementById("tokens_i").value = tokens;
      
    }
      
    else if(fieldAct == "tokens")
    {
    
        let weth = tokens*(sq(pb)-sq(price))/(sq(price)*sq(pb)*(sq(price)-sq(pa)));
        document.getElementById("weth_i").value = weth;
    }   
  }
}

const wethForm = ()=>{

  setfieldAct("ETH")
  let price = 1/document.getElementById("Pr_i").value;
  let pa = 1/document.getElementById("Pa_i").value;
  let pb = 1/document.getElementById("Pb_i").value;
  let weth = document.getElementById("weth_i").value;

  if(pa && pb && price){
    if(price > pb)
    {
      document.getElementById("weth_i").value = 0;
      return;
    }
      
    if(price<= pa)
      document.getElementById("tokens_i").value = 0;
    else{
      let tokens = weth*sq(price)*sq(pb)*(sq(price)-sq(pa))/(sq(pb)-sq(price));
      document.getElementById("tokens_i").value = tokens;
    }
  }

}

const tokensForm = ()=>{

  setfieldAct("tokens")
  let price = 1/document.getElementById("Pr_i").value;
  let pa = 1/document.getElementById("Pa_i").value;
  let pb = 1/document.getElementById("Pb_i").value;
  let tokens = document.getElementById("tokens_i").value;

  if(pa && pb && price){
    if(price < pa)
    {
      document.getElementById("tokens_i").value = 0;
      return;
    }
      
    if(price >= pb)
      document.getElementById("weth_i").value = 0;
    else{
      let weth = tokens*(sq(pb)-sq(price))/(sq(price)*sq(pb)*(sq(price)-sq(pa)));
      document.getElementById("weth_i").value = weth;
    }
  }

}

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
                    <td ><span> <a href="#" onClick={() => props.toggleShow(i)}>{rows["show"] ? "Hide":"Show"}</a>   
                      {!rows["fixed"] ? <a href="#" onClick={() => props.delPos(i)}>Del</a>:null}</span></td>
                </tr>
              );
              })}
              <tr>
                
                <td><input id="Pb_i" placeholder='Lower price' onInput={priceForm}></input></td> 
                <td><input id="Pa_i" placeholder='Upper price' onInput={priceForm}></input></td>
                <td><input id="Pr_i" placeholder='Price' onInput ={priceForm}></input></td>
                <td><input id="weth_i" placeholder='WETH' onInput = {wethForm}></input></td>
                <td><input id="tokens_i" placeholder='Tokens'onInput = {tokensForm} ></input></td>
               
                <td><a href ="#" onClick={addSubmit}>Add</a></td>
              </tr>
            </tbody>
        </table>
    </div>
  )
  else
    return(<div id="data_container"></div>)
}


export default DataField;