const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      nodeIntegration: false
    }
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
          label: `Check for Updates`,
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
          label: `Version ${app.getVersion()}`,
          enabled: false
        },
        {
          label: 'Made by Anthony',
          click: () => shell.openExternal('https://www.spinfinite.com')
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();

  // ✅ Small delay to avoid race condition
  setTimeout(() => {
    autoUpdater.checkForUpdates();
  }, 2000);
});

// ✅ On update downloaded, force install
autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Available',
    message: 'A new version has been downloaded. The app will now restart to install it.',
    buttons: ['Restart']
  }).then(() => {
    autoUpdater.quitAndInstall(false, true); // silent install
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
