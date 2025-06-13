const { spawn } = require('child_process');
const path = require('path');

console.log('>>> Spinfinite main index.js running');

const isWindows = process.platform === 'win32';
const nodeExec = isWindows
  ? process.execPath.replace(/electron\.exe$/, 'node.exe')
  : process.execPath.replace(/Electron$/, 'node');

// Run updater as standalone process
const updater = spawn(nodeExec, [path.join(__dirname, 'updater', 'updater.js')], {
  detached: true,
  stdio: 'ignore'
});
updater.unref();

// Launch main app
require('./main/main.js');
