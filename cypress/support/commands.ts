declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * authenticate a test user with github
       *
       * @returns {typeof authenticate}
       * @memberof Chainable
       * @example
       *    cy.authenticate()
       */
      authenticate: typeof authenticate
    }
  }
}

export function authenticate({redirectUrl}: {redirectUrl: string}) {
  const query = new URLSearchParams()
  query.set('redirectUrl', redirectUrl)

  return cy.visit(`/__tests/github/authenticate?${query.toString()}`)
}

Cypress.Commands.add('authenticate', authenticate)
