const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
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
        { label: 'Reload', click: () => win.reload() },
        {
          label: 'Back',
          click: () => { if (win.webContents.canGoBack()) win.webContents.goBack(); }
        },
        {
          label: 'Forward',
          click: () => { if (win.webContents.canGoForward()) win.webContents.goForward(); }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Made by Anthony',
          click: () => { shell.openExternal('https://www.spinfinite.com'); }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // ✅ Check for updates on startup
  autoUpdater.checkForUpdates();
}

// ✅ Handle update lifecycle
autoUpdater.on('update-available', () => {
  log.info('Update available, downloading...');
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded. Prompting for restart...');

  dialog.showMessageBox({
    type: 'info',
    title: 'Update Ready',
    message: 'A new version of Spinfinite is ready. The app will now restart to apply the update.',
    buttons: ['Restart Now']
  }).then(() => {
    autoUpdater.quitAndInstall(false, true); // silent install, force run after
  });
});

app.whenReady().then(createWindow);
