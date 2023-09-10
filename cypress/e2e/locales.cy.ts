import { supportedLanguages } from "@/i18n/constants";

describe("Page locales", () => {
	supportedLanguages.forEach((lang) => {
		it(`${lang.toUpperCase()} page has no undefined variables`, async () => {
			cy.visit(`/${lang}`);
			cy.get("body").should((body) => {
				const text = body.text();
				const reg = /\{.{1,10}\}/;
				expect(text).not.to.match(reg);
			});
		});
	});
});
