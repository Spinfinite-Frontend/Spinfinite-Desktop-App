const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

// No windows, no GUI
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

autoUpdater.checkForUpdates().then(() => {
  // Exit once check is done
  setTimeout(() => process.exit(0), 2000);
});
