import { app, BrowserWindow,ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import isDev from 'electron-is-dev';
import  {connect,get_positions} from './src/retrieve_positions.mjs';

let mainWindow;

function createWindow(){

  ipcMain.handle('get_data', async (event, args) =>  {
    if(connect(args.rpc)){
      let data = await get_positions(args.address);
      let json = JSON.stringify(data);

      fs.writeFile(path.join(isDev ? '': 
        process.env.PORTABLE_EXECUTABLE_DIR,'./positions.json'),
          json, 'utf8', ()=>{});

      event.sender.send('get_data',{'data': data});
    }
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

