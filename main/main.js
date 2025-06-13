const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

// Logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

function createWindow () {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: { nodeIntegration: false }
  });

  win.loadURL('https://www.spinfinite.com');

  const menuTemplate = [
    {
      label: 'Web',
      submenu: [
        { label: 'Reload', click: () => win.reload() },
        { label: 'Back', click: () => win.webContents.canGoBack() && win.webContents.goBack() },
        { label: 'Forward', click: () => win.webContents.canGoForward() && win.webContents.goForward() }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: `Check for Updates (v${app.getVersion()})`,
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
          click: () => shell.openExternal('https://www.spinfinite.com')
        }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
}

app.whenReady().then(() => {
  createWindow();

  // Optional delay before checking for updates in-app
  setTimeout(() => {
    autoUpdater.checkForUpdates();
  }, 3000);
});

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

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
