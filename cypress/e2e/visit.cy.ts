it("Page Visit", () => {
	cy.visit("http://localhost:3000");
	cy.scrollTo(0, 50);
	cy.wait(15000);
});
