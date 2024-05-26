
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const getPlayersAndGps = require('./get-players');
const getGuildPage = require('./guild-page-finder');

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    });
    win.maximize();
    win.show();
    win.loadFile('client/index.html');
    win.webContents.openDevTools()
};

app.whenReady().then(() => {
    createWindow();
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('get-players', async (event, url) => {
  return await getPlayersAndGps(url);
});

let shouldStop = false;

ipcMain.handle('get-guild-page', async (event, searchStr) => {
  let idx = 1;
  let found = false;
  let info = undefined;
  
  while (/* !found && */ idx < 420) {
      [found, info] = await getGuildPage(idx++, searchStr);
      if (shouldStop) {
        shouldStop = false;
        break;
      }
      if (info) event.sender.send('guild-found', info);
  }
  event.sender.send('guild-search-end');
});

ipcMain.handle('guild-search-stop', () => {
  shouldStop = true;
});
