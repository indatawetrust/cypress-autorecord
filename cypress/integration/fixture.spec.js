// Set config before importing the autorecord file
Cypress.config('autorecord', { maxInlineResponseSize: 0.00001 });

const autoRecord = require('../../index');
const testName = 'records a mock after the test has finished';

// Ensures the next test doesn't load fixtures before they're
// deleted!
describe('beforeSetup', () => {
  beforeEach(() => {
    cy.task('removeAllMocks');
  });

  it('deletes the mocks', () => {
    cy.readFile('../mocks/fixture.spec.json').should('not.exist');
  });
});

describe('setup', () => {
  autoRecord();

  beforeEach(() => {
    cy.visit('cypress/integration/index.html');
  });

  it(testName, () => {
    cy.readFile('../mocks/fixture.spec.json').should('not.exist');
    cy.readFile('../fixtures/fixture-spec').should('not.exist');
    // Ensure the http request has finished
    cy.contains(/"userId":1/i);
  });
});

describe('test', () => {
  context('the generated mock file', () => {
    it('should contain the fixtureId', () => {
      cy.readFile('cypress/mocks/fixture.spec.json').then((mock) => {
        cy.wrap(mock).its(testName).should('exist');

        const { routes } = mock[testName];
        const [route] = routes;

        expect(route).to.have.property('fixtureId');
      });
    });
  });
});
