describe('comments', () => {
  before(() => {
    cy.authenticate({
      redirectUrl: '/',
    })
  })
  it('should allow a user to post a comment', () => {
    cy.visit('/')

    cy.findByRole('navigation').within(() => {
      cy.findByRole('link', {name: /📰 blog/i}).click()
    })

    cy.location('pathname', {timeout: 10000}).should('include', '/blog')

    cy.findByRole('heading', {
      name: /headings & accessibility/i,
    })
      .should('be.visible')
      .click({force: true})

    cy.findByTestId('comments-form').should('be.visible')

    const message = 'Cypress: Testing comments'

    cy.get('textarea[name="body"]').type(message)

    cy.contains('Submit').click()

    cy.contains(message).should('be.visible')

    cy.contains('Delete').first().click()

    cy.contains(message).should('not.exist')
  })
})
