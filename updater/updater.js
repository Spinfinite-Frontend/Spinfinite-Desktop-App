// updater/updater.js
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

// ✅ Only check for updates if this file is run directly
if (require.main === module) {
  autoUpdater.checkForUpdates();
}
