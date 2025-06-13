const { spawn } = require('child_process');
const path = require('path');

// Prevent loop: only run updater if not launched as updater
if (process.env.RUNNING_UPDATER !== '1') {
  const updater = spawn(process.execPath, [path.join(__dirname, 'updater/updater.js')], {
    detached: true,
    stdio: 'ignore',
    env: { ...process.env, RUNNING_UPDATER: '1' } // <- flag this run
  });
  updater.unref();
}

// Then run main app
require('./main/main.js');
