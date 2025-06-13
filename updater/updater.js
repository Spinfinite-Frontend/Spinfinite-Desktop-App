const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

log.transports.file.resolvePath = () => './logs/updater.log';
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

autoUpdater.autoDownload = false;

autoUpdater.on('update-available', () => {
  autoUpdater.downloadUpdate();
});

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall();
});

// Run updater directly, no GUI lifecycle
autoUpdater.checkForUpdates();
