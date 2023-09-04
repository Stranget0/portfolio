describe("Page visit", () => {
	it("page has no errors", () => {
		const page = cy.visit("/", {
			onLoad() {
				page.screenshot("fox");
			},
		});
	});
});
