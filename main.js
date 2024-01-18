//const { app, BrowserWindow } = require('electron')
import { app, BrowserWindow } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600
    })
  
    win.loadFile('index.html')
  }

  app.whenReady().then(() => {
    createWindow()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })