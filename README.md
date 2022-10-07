> :warning: This project has been modified to run on cypress 10 and above. May not work correctly for versions before cypress 10. For older versions you can try using the main package from which this package was cloned. https://github.com/Nanciee/cypress-autorecord

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/indatawetrust/cypress-autorecord/tree/master.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/indatawetrust/cypress-autorecord/tree/master)

# Cypress Autorecord

Cypress Autorecord is a plugin built to be used with Cypress.io. It simplifies mocking by auto-recording/stubbing HTTP interactions and automating the process of updating/deleting recordings. Spend more time writing integration tests instead of managing your mock data. Refer to the [changelog](https://github.com/indatawetrust/cypress-autorecord/blob/master/CHANGELOG.md) for more details on all the changes.

## Getting Started

Install from npm

```
npm install --save-dev @cond/cypress-autorecord
```

Add the plugin to the main configuration as follows

```js
const { defineConfig } = require('cypress');
const fs = require('fs');
const autoRecord = require('@cond/cypress-autorecord/plugin');

module.exports = defineConfig({
  e2e: {
    specPattern: '**/*spec.{js,jsx,ts,tsx}',
    async setupNodeEvents(on, config) {
      autoRecord(on, config, fs);
  
      return config;
    },
  },
});

```
To allow for auto-recording and stubbing to work, require cypress-autorecord in each of your test file and call the function at the beginning of your parent `describe` block.

```js
const autoRecord = require('@cond/cypress-autorecord'); // Require the autorecord function
  
describe('Home Page', () => {
  autoRecord(); // Call the autoRecord function at the beginning of your describe block
  
  // Your hooks (beforeEach, afterEach, etc) goes here
  
  it('...', () => {
    // Your test goes here
  });
});
```

That is it! Now, just run your tests and the auto-record will take care of the rest!

## Updating Mocks

In the case you need to update your mocks for a particular test:
```js
const autoRecord = require('@cond/cypress-autorecord');
  
describe('Home Page', () => {
  autoRecord();
  
  it('[r] my awesome test', () => { // Insert [r] at the beginning of your test name
    // ...
  });
});
```
This will force the test to record over your existent mocks for **ONLY** this test on your next run.

This can also be done through the configurations by adding the test name in the file `cypress.config.js`:

```json
  "autorecord": {
    "recordTests": ["my awesome test"]
  }
```

Alternatively, you can update recordings for all tests by setting `forceRecord` to `true` before rerunning your tests:

```json
  "autorecord": {
    "forceRecord": true
  }
```

## Removing Stale Mocks

Stale mocks that are no longer being used can be automatically removed when you run your tests by setting `cleanMocks` to `true` in the file `cypress.config.js`:

```json
  "autorecord": {
    "cleanMocks": true
  }
```

**_NOTE: Only mocks that are used during the run are considered "active". Make sure to only set `cleanMocks` to `true` when you are running ALL your tests. Remove any unintentional `.only` or `.skip`._**

## Set Recording Pattern For Cypress Intercept

By default autorecorder is recording all outgoing requests but if you want to record only specific calls based on pattern(Ex. just record api calls on backend), you can set `interceptPattern` in `cypress.config.js`. it can be string, regex or glob

```json
  "autorecord": {
    "interceptPattern": "http://localhost:3000/api/*"
  }
```

## How It Works

### How does the recording and stubbing work?
Cypress Autorecord uses Cypress' built-in `cy.intercept` to hook into every request, including GET, POST, DELETE and PUT. If mocks doesn't exist for a test, the http calls (requests and responses) are captured and automatically written to a local file. If mocks exist for a test, each http call will be stubbed in the `beforeEach` hook.

### Where are the mocks saved?
The mocks will be automatically generated and saved in the `/cypress/mocks/` folder. Mocks are grouped by test name and test file name. You will find mock files matching the name of your test files. Within your mock files, mocks are organized by test names in the order that they were called. Changing the test file name or test name will result to a disconnection to the mocks and trigger a recording on your next run.

### Can I manually update the mocks?
Mocks are saved as a simple json object and can be updated manually. This is **not** recommended since any manual change you make will be overwritten when you automatically update the mocks. Leave the data management to cypress-autorecord. Make any modifications to the http calls inside your test so that it will be consistent across recordings.

```js
it('should display an error message when send message fails', () => {
  cy.intercept({
    url: '/message',
    method: 'POST',
    statusCode: 404,
    body: { error: 'It did not work' },
  });

  cy.get('[data-cy="msgInput"]').type('Hello World!');
  cy.get('[data-cy="msgSend"]').click();
  cy.get('[data-cy="errorMessage"]').should('contain', 'Looks like we ran into a problem. Please try again.');
});
```

## Known Issues

#### Only XMLHttpRequests will be recorded and stubbed
Cypress-autorecord leverages Cypress' built in `cy.route` to handle stubbing, which means that it inherits some limitations as well. This is the disclaimer on the `cy.route` documentation page with some potential workarounds:
>Please be aware that Cypress only currently supports intercepting XMLHttpRequests. Requests using the Fetch API and other types of network requests like page loads and <script> tags will not be intercepted or visible in the Command Log. See [#95](https://github.com/cypress-io/cypress/issues/95) for more details and temporary workarounds.

## Contributions
I would really appreciate any help with bug fixes or any new features you think might be relevant! Feel free to submit a PR!
