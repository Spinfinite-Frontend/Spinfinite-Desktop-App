const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) app.quit();

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    icon: path.join(__dirname, 'icon.ico'),
    backgroundColor: '#2B3241',
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadURL('https://www.spinfinite.com');

  // Set application menu
  const menu = Menu.buildFromTemplate([
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          submenu: [
            { label: `Version: v${app.getVersion()}`, enabled: false },
            {
              label: 'Check for Updates',
              click: () => {
                autoUpdater.checkForUpdates().then(result => {
                  if (!result?.updateInfo || result.updateInfo.version === app.getVersion()) {
                    dialog.showMessageBox({
                      type: 'info',
                      title: 'No Update Available',
                      message: 'You’re already on the latest version.',
                      buttons: ['OK']
                    });
                  }
                }).catch(() => {
                  dialog.showMessageBox({
                    type: 'error',
                    title: 'Update Check Failed',
                    message: 'Could not check for updates. Please try again later.',
                    buttons: ['OK']
                  });
                });
              }
            },
            { label: 'Made by Anthony', enabled: false }
          ]
        },
        {
          label: 'Need Help?',
          click: () => shell.openExternal('https://www.spinfinite.com/help/faq/')
        }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);
}

// Auto-update popup
autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Ready',
    message: 'A new version has been downloaded. Restart to install now.',
    buttons: ['Restart']
  }).then(() => {
    autoUpdater.quitAndInstall(false, true);
  });
});

app.whenReady().then(() => {
  createWindow();
  setTimeout(() => autoUpdater.checkForUpdates(), 3000);
});

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// 🔁 IPC for renderer
ipcMain.handle('nav-action', (_, action) => {
  if (!win || win.isDestroyed()) return;
  switch (action) {
    case 'back':
      if (win.webContents.canGoBack()) win.webContents.goBack();
      break;
    case 'forward':
      if (win.webContents.canGoForward()) win.webContents.goForward();
      break;
    case 'refresh':
      win.webContents.reload();
      break;
  }
});

ipcMain.handle('get-url', () => {
  return win ? win.webContents.getURL() : '';
});
