const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('customApi', {
  sendMessage: (message) => {
    ipcRenderer.send('message:send', message)
  },
  handleMessages: (callback) => {
    ipcRenderer.on('message:received', callback)
  },
  handleOldMessages: (callback) => {
    ipcRenderer.on('message:send', callback)
  }
})
