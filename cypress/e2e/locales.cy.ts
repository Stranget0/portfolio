describe("Page locales", () => {
	it(`PL page has no undefined variables`, async () => {
		cy.visit(`/pl`);
		cy.get("body").should((body) => {
			const text = body.text();
			const reg = /\{.{1,10}\}/;
			expect(text).not.to.match(reg);
		});
	});

	it(`EN page has no undefined variables`, async () => {
		cy.visit(`/en`);
		cy.get("body").should((body) => {
			const text = body.text();
			const reg = /\{.{1,10}\}/;
			expect(text).not.to.match(reg);
		});
	});
});
