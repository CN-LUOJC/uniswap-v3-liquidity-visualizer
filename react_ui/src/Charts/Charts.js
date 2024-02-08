import React from 'react';
import './Charts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap/dist/js/bootstrap.min.js'; 
//import 'jquery/dist/jquery.min.js';

function Charts(props){

  if(props.state === "data"){
    return(
      <p>Charts</p>
    )
  }
  else
    return(
      <></>
    )
}


export default Charts;