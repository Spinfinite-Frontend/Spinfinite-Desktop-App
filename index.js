const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      nodeIntegration: false
    }
  });

  mainWindow.loadURL('https://www.spinfinite.com');

  const menuTemplate = [
    {
      label: 'Web',
      submenu: [
        { label: 'Reload', click: () => mainWindow.reload() },
        { label: 'Back', click: () => { if (mainWindow.webContents.canGoBack()) mainWindow.webContents.goBack(); }},
        { label: 'Forward', click: () => { if (mainWindow.webContents.canGoForward()) mainWindow.webContents.goForward(); }}
      ]
    },
    {
      label: 'Help',
      submenu: [
        { label: 'Made by Anthony', click: () => shell.openExternal('https://www.spinfinite.com') }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // Check for updates
  autoUpdater.checkForUpdates();
}

// Pop up when update is downloaded
autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Ready',
    message: 'A new version of Spinfinite is ready. Restart now to install it.',
    buttons: ['Restart Now']
  }).then(() => {
    autoUpdater.quitAndInstall(false, true);
  });
});

app.whenReady().then(createWindow);
