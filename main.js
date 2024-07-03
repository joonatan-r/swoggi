
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('fs');
const getPlayersAndGps = require('./get-players');
const getGuildPage = require('./guild-page-finder');
const calculateTeams = require('./calculate-teams');
const configFile = path.join(__dirname, 'config.txt')

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
    // win.webContents.openDevTools();
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

let guildSearchRunning = false;
let shouldStopGuildSearch = false;

ipcMain.handle('get-guild-page', async (event, searchStr) => {
  let idx = 1;
  let found = false;
  let info = undefined;
  
  while (/* !found && */ idx < 420) {
      guildSearchRunning = true;
      [found, info] = await getGuildPage(idx++, searchStr);
      if (shouldStopGuildSearch) {
        shouldStopGuildSearch = false;
        break;
      }
      if (info) event.sender.send('guild-found', info);
  }
  guildSearchRunning = false;
  event.sender.send('guild-search-end');
});

ipcMain.handle('guild-search-stop', () => {
  if (guildSearchRunning) {
    shouldStopGuildSearch = true;
  }
});

ipcMain.handle('calculate-teams', (event, nbrOfTeams, minTeamsPerPlayer, maxTeamsPerPlayer, players) => {
  return calculateTeams(nbrOfTeams, minTeamsPerPlayer, maxTeamsPerPlayer, players);
});

ipcMain.handle('get-config', () => {
  try {
    return JSON.parse(fs.readFileSync(configFile, { encoding: 'utf-8' })?.trim());
  } catch (e) {
    return null;
  }
});

ipcMain.handle('write-config', (event, config) => {
  try {
    fs.writeFileSync(configFile, JSON.stringify(config), { encoding: 'utf-8' });
  } catch (e) {}
});
