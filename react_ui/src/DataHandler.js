import React,{useEffect, useState}  from 'react';
import SettingsBar from './SettingsBar/SettingsBar';
import DataField from './DataField/DataField';





function DataHandler(){
   
    const [rpc, setRpc] = useState("");
    const [address, setAddress] = useState("")
    const [state, setState] = useState("empty")
    const [data, setData] = useState()

    
      
            useEffect(() => { 
                window.ipcRenderer.on("get_data",(value,args)=>{
                    setState("data")
                    setData(args.data)
                    console.log(args.data)})

            },[]);

   

    useEffect(()=>{
    
        if(rpc && address && !data){
            setState("loading");
            window.ipcRenderer.invoke("get_data",{ "rpc":rpc,"address": address })
        }
        
    },[address])

    return(
        <div>
        <SettingsBar setRpc ={setRpc} setAddress = {setAddress}/>
        <DataField state = {state} data = {data}/>
        </div>
    )}

export default DataHandler;