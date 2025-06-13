const { spawn } = require('child_process');
const path = require('path');

// Only run the updater, not as an Electron process
spawn(process.execPath, [path.join(__dirname, 'updater', 'updater.js')], {
  detached: true,
  stdio: 'ignore'
}).unref();

// Now launch main app UI
require('./main/main.js');
