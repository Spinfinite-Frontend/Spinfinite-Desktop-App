const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

// Setup logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

// Prevent multiple app instances
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  return;
}

let win;

function createWindow () {
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    icon: path.join(__dirname, 'icon.ico'),
    backgroundColor: '#2B3241',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    }
  });

  win.loadURL('https://www.spinfinite.com');

  const menuTemplate = [
    {
      label: 'Web',
      submenu: [
        { label: 'Refresh', click: () => win.reload() },
        { label: 'Back', click: () => win.webContents.canGoBack() && win.webContents.goBack() },
        { label: 'Forward', click: () => win.webContents.canGoForward() && win.webContents.goForward() }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          submenu: [
            {
              label: `Version: v${app.getVersion()}`,
              enabled: false
            },
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
            {
              label: 'Made by Anthony',
              enabled: false
            }
          ]
        },
        {
          label: 'Need Help?',
          click: () => {
            shell.openExternal('https://www.spinfinite.com/help/faq/');
          }
        }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
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

  setTimeout(() => {
    autoUpdater.checkForUpdates();
  }, 3000);
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
