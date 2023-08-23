it('titles are correct', () => {
  const page = cy.visit('http://localhost:3000');
	cy.scrollTo(0,50)
  cy.wait(5000)
	page.screenshot("fox")
});