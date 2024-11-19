/// <reference types="cypress" />

describe('Discord Interface', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/messages/*', { fixture: 'messages.json' }).as('getMessages');
    cy.visit('/');
  });

  it('loads and displays messages', () => {
    cy.wait('@getMessages');
    cy.get('.message-item').should('have.length.gt', 0);
  });

  it('can send a message', () => {
    cy.intercept('POST', '/api/messages/*', { statusCode: 200 }).as('sendMessage');
    
    cy.get('.message-input textarea').type('Test message{enter}');
    cy.wait('@sendMessage');
    cy.get('.message-item').last().should('contain', 'Test message');
  });

  it('can add reactions', () => {
    cy.get('.message-item').first().within(() => {
      cy.get('.add-reaction').click();
      cy.get('.emoji-list button').first().click();
    });
    
    cy.get('.message-item').first().find('.reaction-item').should('exist');
  });
}); 