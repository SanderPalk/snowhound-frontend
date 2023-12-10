describe('template spec', () => {
  it('Add new movie test with form validation', () => {
    //Landing page
    cy.visit('http://localhost:3000/')

    //Navigate to add new page, verify
    cy.get(':nth-child(1) > .w-100 > :nth-child(2)').click()
    cy.get('h3.text-start').should('have.text', "Add movie")

    //Name validation
    cy.get('.w-75 > .d-flex > .btn').click()
    cy.get('.alert').contains('The name is empty')
    cy.get('#name').type("The Wolf of Wall Street")

    //EIDR validation
    cy.get('.w-75 > .d-flex > .btn').click()
    cy.get('.alert').contains('The EIDR code is empty')
    cy.get('#eidr').type("10.5240/2C6F-AF74-E76A-7E6B-1D09-K")

    //Category validation
    cy.get('.w-75 > .d-flex > .btn').click()
    cy.get('.alert').contains('No categories assigned')
    cy.get('.mbsc-textfield-tags').click()
    cy.get(':nth-child(42)').click()
    cy.get('.mbsc-popup-overlay').click()

    //Fill other information
    cy.get('#year').clear().type(2013)
    cy.get("#rating").clear().type(8.2)

    //Save movie
    cy.get('.w-75 > .d-flex > .btn').click()
    cy.get('.mbsc-popup > .mbsc-flex-col > .mbsc-flex-1-1').contains("New movie added")
    cy.get('.mbsc-flex-1-1 > .btn').click()

    //Try to save the same movie
    cy.get('#name').type("The Wolf of Wall Street")
    cy.get('#eidr').type("10.5240/2C6F-AF74-E76A-7E6B-1D09-K")

    cy.get('.mbsc-textfield-tags').click()
    cy.get(':nth-child(42)').click()
    cy.get('.mbsc-popup-overlay').click()

    cy.get('#year').clear().type(2013)
    cy.get("#rating").clear().type(8.2)
    cy.get('.w-75 > .d-flex > .btn').click()
    cy.get('.alert').contains('EIDR code in use')
  })
})