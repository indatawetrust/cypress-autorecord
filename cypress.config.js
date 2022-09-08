const { defineConfig } = require('cypress');
const fs = require('fs');
const autoRecord = require('./plugin');

module.exports = defineConfig({
  e2e: {
    specPattern: '**/*spec.{js,jsx,ts,tsx}',
    async setupNodeEvents(on, config) {
      autoRecord(on, config, fs);
  
      return config;
    },
  },
  video: false,
  screenshotOnRunFailure: false,
});
