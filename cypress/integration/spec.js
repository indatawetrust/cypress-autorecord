const autoRecord = require('../../index');
const testName = 'records a mock after the test has finished';

describe('setup', () => {
  autoRecord();

  beforeEach(() => {
    cy.task('removeAllMocks');
    cy.visit('cypress/integration/index.html');
  });

  it(testName, () => {
    cy.readFile('../mocks/spec.json').should('not.exist');
    // Ensure the http request has finished
    cy.contains(/"userId":1/i);
  });
});

describe('test', () => {
  context('the generated mock file', () => {
    it('should contain the json response', () => {
      cy.readFile('cypress/mocks/spec.json').then((mock) => {
        cy.wrap(mock).its(testName).should('exist');

        const { routes } = mock[testName];
        const [{ response }] = routes;

        expect(response).to.include({ userId: 1, id: 1 });
      });
    });
  });
});
