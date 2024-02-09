import { app, BrowserWindow,ipcMain } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';
import  {connect,get_positions,get_ids} from './src/liquidity_positions.mjs';

let mainWindow;

function createWindow(){

  ipcMain.handle('get_data', async (event, args) =>  {
    if(await connect(args.rpc)){
      
      let positionsIds = await get_ids(args.address);
      if(!positionsIds)
        return {"error":"Pool address seems invalid..."};

      let data = await get_positions(positionsIds);
      if(!data)
        return {"error":"Can't access the address data..."};

     return {'data': data, "error":false};
    }
    else
      return {"error":"Can't connect to Rpc provider !"};
    
  });

  mainWindow = new BrowserWindow({
    minWidth: 750,
    width: 900,
    minHeight: 350,
    height: 600,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: false,
      enableRemoteModule: false, 
      preload: path.join(app.getAppPath(), './preload.js')
    }
  });

  const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(app.getAppPath(), '../ui/index.html')}`;
  
  mainWindow.setTitle('V3 Liquidity Optimizer');
  
  mainWindow.removeMenu();
  mainWindow.loadURL(startURL);
  //mainWindow.loadFile("./react_ui/build/index.html");
  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') 
    app.quit();
  
});

app.on('activate', () => {
  if (mainWindow === null) 
    createWindow();
  
});

