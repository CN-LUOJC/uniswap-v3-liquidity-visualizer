import { useState } from "react";


function sq(i){
  return Math.sqrt(i);
}

function AddForm(props){

   //active field in form
   const [fieldAct,setFieldAct] = useState(0);
   const [formShow,setFormShow] = useState(false);

  const addSubmit = () =>{
    let pa = 1/document.getElementById("Pa_i").value
    let pb = 1/document.getElementById("Pb_i").value
    let price = 1/document.getElementById("Pr_i").value
    let weth = document.getElementById("weth_i").value
    let tokens = document.getElementById("tokens_i").value
    
    if(pa < 0 || pb < 0 || price < 0 || weth <0 || tokens < 0 || pa === pb)
      return

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

    setFormShow(false);
    props.addPos(pa,pb,liq);
  }

  
  const priceCont = ()=>{
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
      else if(fieldAct === "ETH")
      {
          let tokens = weth*sq(price)*sq(pb)*(sq(price)-sq(pa))/(sq(pb)-sq(price));
          document.getElementById("tokens_i").value = tokens;
      }
        
      else if(fieldAct === "tokens")
      {
          let weth = tokens*(sq(pb)-sq(price))/(sq(price)*sq(pb)*(sq(price)-sq(pa)));
          document.getElementById("weth_i").value = weth;
      }   
    }
  }
  
  const wethCont = ()=>{
  
    setFieldAct("ETH")
    let price = 1/document.getElementById("Pr_i").value;
    let pa = 1/document.getElementById("Pa_i").value;
    let pb = 1/document.getElementById("Pb_i").value;
    let weth = document.getElementById("weth_i").value;
  
    if(pa && pb && price){
      if(price >= pb)
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
  
  const tokensCont = ()=>{
  
    setFieldAct("tokens")
    let price = 1/document.getElementById("Pr_i").value;
    let pa = 1/document.getElementById("Pa_i").value;
    let pb = 1/document.getElementById("Pb_i").value;
    let tokens = document.getElementById("tokens_i").value;
  
    if(pa && pb && price){
      if(price <= pa)
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
  
  if(formShow){

    return(
      <tr>
                  
        <td><input id="Pb_i" placeholder='Lower price' onInput={priceCont}></input></td> 
        <td><input id="Pa_i" placeholder='Upper price' onInput={priceCont}></input></td>
        <td><input id="Pr_i" placeholder='Price' onInput ={priceCont}></input></td>
        <td><input id="weth_i" placeholder='WETH' onInput = {wethCont}></input></td>
        <td><input id="tokens_i" placeholder='Tokens'onInput = {tokensCont} ></input></td>
        
        <td><a href ="#" onClick={addSubmit}>Add</a></td>
      </tr>
    )
  }
  else{
    return(
      <tr style = {{"textAlign":'right'}}>
                  
        <td></td> 
        <td><a  href ="#" onClick={()=>setFormShow(true)}>Add</a></td>
        <td ></td>
       
        <td></td>
        <td></td>
        <td></td>
        
      </tr>
    )
  }
}

export default AddForm;