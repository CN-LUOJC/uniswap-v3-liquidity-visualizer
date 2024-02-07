import React from 'react';
import './SettingsBar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap/dist/js/bootstrap.min.js'; //import 'jquery/dist/jquery.min.js';



function SettingsBar(props){

  function onSubmitRpc(e){
    e.preventDefault();
    props.setRpc(document.getElementById("input1").value);
   }
   
   function onSubmitAddress(e){
    e.preventDefault();
    props.setAddress(document.getElementById("input2").value);
    }

  return(
        <div className="maincontainer">
        
         
      
        <nav class="navbar navbar-icon-top navbar-dark bg-dark">
             
        
                  
                  
        <form class="form-inline my-2 my-lg-0" onSubmit={onSubmitRpc}>
                      <input id="input1"  defaultValue ="https://ethereum.publicnode.com" class="form-control mr-sm-2" type="text" placeholder="RPC provider" aria-label="Search" />
                      <button id="btn1" class="btn btn-outline-success my-2 my-sm-0" type="submit">Set</button>
                      </form>
                      <form class="form-inline my-2 my-lg-0" onSubmit={onSubmitAddress}>
                      <input  id="input2" defaultValue ="0x7d45a2557becd766a285d07a4701f5c64d716e2f" class="form-control mr-sm-2" type="text" placeholder="Address" aria-label="Search" />
                      <button id="btn2" class="btn btn-outline-success my-2 my-sm-0" type="submit">Get Pools</button>
                      </form>
                  
                  </nav>
              
              </div> 
           
      
    )
  }

export default SettingsBar;