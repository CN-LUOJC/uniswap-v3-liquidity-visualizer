import React,{useEffect, useState}  from 'react';
import SettingsBar from './SettingsBar/SettingsBar';
import DataField from './DataField/DataField';
import Charts from './Charts/Charts';
import './App.css'



function App(){
   
  const [rpc, setRpc] = useState("https://ethereum.publicnode.com");
  const [state, setState] = useState("clear")
  const [data, setData] = useState()


  const saveOpen = ()=>{
    const content = JSON.stringify(data);
    const element = document.createElement("a");
    const blob = new Blob([content], {type: "application/json"});
    const file = new File([blob], 'data.json', {
      type:blob.type,
  });
    element.href = URL.createObjectURL(file);
    element.download = "positions.json";
    element.style.display = 'none';
    element.click();
    URL.revokeObjectURL(element.href);
  }


  const loadOpen = ()=>{
    const element = document.createElement("input");
    element.type = "file";
    element.addEventListener("change",async event =>{
      
      let object = await new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = event => resolve(JSON.parse(event.target.result))
        fileReader.onerror = error => reject(error)
        fileReader.readAsText(event.target.files[0])
      });
      
      setData([...object]);
      setState("show_data");
    })
    element.click();
  }
  
  
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
   
  const fetch_data = async(address)=> {
    
    if(rpc && address && state != "loading"){
      setState("loading");
    
      let result = await window.ipcRenderer.invoke("get_data",{ "rpc":rpc,"address": address })
      
      if(!result.error){
          
  
          let positions = result.data;
          positions.forEach((pos, index) => {
            positions[index].Pb = 1/(1.0001**pos.tickLower);
            positions[index].Pa = 1/(1.0001**pos.tickUpper);
            
            positions[index].show = positions[index].liquidity ? true:false;
            positions[index].fixed = true;
          });
          setState("show_data")
          setData(positions);
         
        }
        else
        {
          alert(result.error)
          setState("clear");
        }
    }
  }

  return(
      <div className="App">
          <SettingsBar setRpc ={setRpc} fetchData = {fetch_data} saveOpen ={saveOpen} loadOpen={loadOpen}/>
          <DataField state = {state} data = {data} toggleShow ={toggleShow} addPos={addPos} delPos={delPos}/>
          <Charts state = {state} data = {data}/>
      </div>
  )}

export default App;