import React,{useEffect, useState}  from 'react';
import SettingsBar from './SettingsBar/SettingsBar';
import DataField from './DataField/DataField';
import Charts from './Charts/Charts';
import './App.css'


function App(){
   
  const [rpc, setRpc] = useState("https://ethereum.publicnode.com");
  const [address, setAddress] = useState({value :""})
  const [state, setState] = useState("empty")
  const [data, setData] = useState()

  useEffect(() => { 
    
    window.ipcRenderer.on("get_data",(value,args)=>{
      setState("data")
      setData(args.data)
      console.log(args.data)})
  
    },[]);

  useEffect(()=>{
    
    if(rpc && address.value && !data){
      setState("loading");
      window.ipcRenderer.invoke("get_data",{ "rpc":rpc,"address": address.value })
    }

  },[address])

  return(
      <div id="mainContainer" className="App">
          <SettingsBar setRpc ={setRpc} setAddress = {setAddress}/>
          <DataField state = {state} data = {data}/>
          <Charts state = {state} data = {data}/>
      </div>
  )}

export default App;