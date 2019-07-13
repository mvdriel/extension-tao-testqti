/**
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2019 (original work) Open Assessment Technologies SA ;
 */

import setupData from './setupData';
import setupSelectors from './setupSelectors';
import base64Test from './base64QtiExampleTestPackage';

/**
 * Commands
 */
Cypress.Commands.add('publishImportedTest', () => {
    
    // Visit Tests page
    cy.visit(setupData.testsPage.testsPageUrl);
    
    // Select test import
    cy.get(setupSelectors.testsPage.testImportbutton).click();

    // Upload example qti test file to file input
    cy.get(setupSelectors.testsPage.fileInput).upload(
        {
            fileContent: base64Test, 
            fileName: 'e2eExampleTest.zip', 
            mimeType: 'application/zip'
        }, 
        { 
            subjectType: 'input' 
        }
    );

    // Wait until loader loads
    cy.wait(1000);

    // Import selected example test file
    cy.get(setupSelectors.testsPage.fileImportButton).click();

    // Continue
    cy.get(setupSelectors.testsPage.feedbackContinueButton).click();

    // Wait until publish button appears
    cy.wait(500);

    // Publish example test
    cy.get(setupSelectors.testsPage.testPublishButton).click();

    // Select Assembled Delivery as root class for publishing
    cy.get(setupSelectors.testsPage.destinationSelector).contains('Assembled Delivery').click();

    // Clicking on publish
    cy.get(setupSelectors.testsPage.destinationSelector).contains('Publish').click();
});

Cypress.Commands.add('setDeliveryForGuests', () => {
    // Go to Deliveries page
    cy.visit(setupData.deliveriesPageUrl);

    // Select example delivery
    cy.get(setupSelectors.deliveriesPage.resourceTree).contains('Delivery of e2e example test').click();

    // Set guest access on the delivery
    cy.get(setupSelectors.deliveriesPage.formContainer).contains('Guest Access').click();

    // Save delivery
    cy.get(setupSelectors.deliveriesPage.formContainer).contains('Save').click();
});