const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

// ✅ Auto-updater
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

function createWindow () {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      nodeIntegration: false
    }
  });

  win.loadURL('https://www.spinfinite.com');

  // Custom menu
  const menuTemplate = [
    {
      label: 'Web',
      submenu: [
        {
          label: 'Reload',
          click: () => win.reload()
        },
        {
          label: 'Back',
          click: () => {
            if (win.webContents.canGoBack()) {
              win.webContents.goBack();
            }
          }
        },
        {
          label: 'Forward',
          click: () => {
            if (win.webContents.canGoForward()) {
              win.webContents.goForward();
            }
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Made by Anthony',
          click: () => {
            shell.openExternal('https://www.spinfinite.com');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // ✅ Check for updates when ready
  autoUpdater.checkForUpdatesAndNotify();
}

app.whenReady().then(createWindow);
