//handle setupevents as quickly as possible
const setupEvents = require('./installers/windows/setupEvents')
if (setupEvents.handleSquirrelEvent()) {
   // squirrel event handled and app will exit in 1000ms, so don't do anything else
   return;
}

const electron = require('electron')
// Module to control application life.
//const app = electron.app
const {ipcMain} = require('electron')
//var path = require('path')

const {
  app,
  BrowserWindow
} = require('electron')
const url = require("url");
const path = require("path");
let appWindow
function initWindow() {
  appWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })
  // Electron Build Path
  appWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  // Initialize the DevTools.
  appWindow.webContents.openDevTools()
  appWindow.on('closed', function () {
    appWindow = null
  })
}
app.on('ready', initWindow)
// Close when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', function () {
  if (win === null) {
    initWindow()
  }
})

require('update-electron-app')({
  repo: 'github-user/repo',
  updateInterval: '1 hour',
  logger: require('electron-log')
})
