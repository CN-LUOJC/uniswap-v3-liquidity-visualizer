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

  const toggleShow = i => {
 
    data[i].show = data[i].show ?  false:true;
    setData([...data]);
  
  }

  const addPos = (Pa,Pb,liq) =>{
    data.push({Pa:Pa,Pb:Pb,liquidity:liq,fixed:false,show:true});
    setData([...data]);

  }

  const delPos = (i) =>{
    data.splice(i,1);
    setData([...data]);
  }

  useEffect(() => { 
    
    window.ipcRenderer.on("get_data",(value,args)=>{

     

      if(args.data){
        setState("data")

        let positions = args.data;
        positions.forEach((pos, index) => {
          positions[index].Pb = 1/(1.0001**pos.tickLower);
          positions[index].Pa = 1/(1.0001**pos.tickUpper);
          
          positions[index].show = positions[index].liquidity ? true:false;
          positions[index].fixed = true;
        });

        setData(positions);
       
      }
      else
        setState("empty");
      
    })
  
    },[]);

  useEffect(()=>{
    
    if(rpc && address.value && state != "loading"){
      setState("loading");
      window.ipcRenderer.invoke("get_data",{ "rpc":rpc,"address": address.value })
    }

  },[address])

  return(
      <div id="mainContainer" className="App">
          <SettingsBar setRpc ={setRpc} setAddress = {setAddress}/>
          <DataField state = {state} data = {data} toggleShow ={toggleShow} addPos={addPos} delPos={delPos}/>
          <Charts state = {state} data = {data}/>
      </div>
  )}

export default App;