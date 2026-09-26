export const ALERT_TEST_DATA = {
  simpleAlert: {
    description: 'Simple Alert Dialog',
    expectedAction: 'Accept',
  },
  confirmAlert: {
    description: 'Confirm Box Dialog',
    acceptResult: 'You pressed OK',
    rejectResult: 'You pressed Cancel',
  },
  promptAlert: {
    description: 'Prompt Box Dialog',
    testInputs: ['John Doe', 'Test User 123', 'Playwright Automation'],
  },
};

export const ALERT_MESSAGES = {
  simpleAlert: 'I am an alert box!',
  confirmAlert: 'Press a button!',
  promptAlert: 'Please enter your name:',
};
