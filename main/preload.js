const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onUrlChange: (callback) => ipcRenderer.on('set-url', (_, url) => callback(url))
});