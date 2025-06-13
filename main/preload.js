const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  navAction: action => ipcRenderer.invoke('nav-action', action),
  getUrl: () => ipcRenderer.invoke('get-url')
});
