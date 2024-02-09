window.ipcRenderer = require('electron').ipcRenderer;

window.alert = (message)=>{
    window.ipcRenderer.send("alert",{"alert":message});
}