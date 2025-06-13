const { spawn } = require('child_process');
const path = require('path');

// ✅ Only spawn updater if not already updating
if (!process.env.IS_UPDATER) {
  const updater = spawn(process.execPath, [path.join(__dirname, 'updater', 'updater.js')], {
    detached: true,
    stdio: 'ignore',
    env: { ...process.env, IS_UPDATER: '1' }
  });
  updater.unref();
}

// ✅ Then start the main app
require('./main/main.js');
