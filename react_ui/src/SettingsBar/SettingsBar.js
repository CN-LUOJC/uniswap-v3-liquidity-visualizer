import React from 'react';
import './SettingsBar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap/dist/js/bootstrap.min.js'; 
//import 'jquery/dist/jquery.min.js';


function SettingsBar(props){

  function onSubmitRpc(){
    props.setRpc(document.getElementById("input1").value);
  }
   
  function onSubmitAddress(e){
    e.preventDefault();
    props.fetchData(document.getElementById("input2").value);
  }

  return(
      <div id="nav_container" className="maincontainer">
          <nav class="navbar navbar-icon-top navbar-dark bg-dark">
          <span id="save"><a href ="#" onClick={props.loadOpen}>Load</a><a href="#" onClick={props.saveOpen}>Save</a>
              </span>      
              
             

              <form class="form-inline my-2 my-lg-0" onSubmit={onSubmitAddress}>
              <input id="input1" onChange={onSubmitRpc} defaultValue ="https://ethereum.publicnode.com" class="form-control mr-sm-2" type="text" placeholder="RPC provider" aria-label="Search" />
              
                  <input  id="input2" defaultValue ="0x7d45a2557becd766a285d07a4701f5c64d716e2f" class="form-control mr-sm-2" type="text" placeholder="Address" aria-label="Search" />
                  <button id="btn2" class="btn btn-outline-success my-2 my-sm-0" type="submit">Get Pools</button>
              </form>
                  
          </nav>        
      </div>       
  )
}

export default SettingsBar;