const { spawn } = require('child_process');
const path = require('path');

if (!process.env.IS_UPDATER) {
  const updater = spawn(process.execPath, [path.join(__dirname, 'updater', 'updater.js')], {
    detached: true,
    stdio: 'ignore',
    env: { ...process.env, IS_UPDATER: '1' }
  });
  updater.unref();
}

require('./main/main.js');
