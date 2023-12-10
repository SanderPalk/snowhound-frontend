import React from 'react'
import AddMovie from './AddMovie'

describe('<AddMovie />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<AddMovie />)
  })
})