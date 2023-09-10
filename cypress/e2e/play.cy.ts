import { wordClasses } from "@/components/AppearingText/constants";
import { mainpageTabs } from "@/constants";

beforeEach(() => {
	cy.intercept("/src/components/AppearingText/AppearingTextButton.tsx").as(
		"button",
	);
	cy.visit("/en");
	cy.get(`#${mainpageTabs.play.id}`)
		.as("playSection")
		.scrollIntoView({ duration: 0 });
	cy.wait("@button");
	cy.get(`#${mainpageTabs.play.id} button`)
		.invoke("removeClass", "appear-item")
		.as("playButton");
	cy.wait(150);
});

describe("Website playing", () => {
	it("lines should appear correctly", () => {
		cy.get("@playButton").click();
		cy.wait(300)
		cy.get("." + wordClasses.high).should("have.length", 1);
		cy.get("." + wordClasses.semi).should("exist");
	});

	it("buttons should show correct icon", () => {
		function check(state: 1 | 2 | 3) {
			cy.get(".i-mingcute-volume-fill\\?mask").should(
				haveCorrectStatusForState(1),
			);
			cy.get(".i-mingcute-close-fill\\?mask").should(
				haveCorrectStatusForState(3),
			);

			function haveCorrectStatusForState(num: 1 | 2 | 3): string {
				return state === num ? "be.visible" : "not.be.visible";
			}
		}

		check(1);
		cy.get("@playButton").click();
		check(3);
	});

	it("lines should reset after playing", () => {
		const playButton = cy.get("@playButton");

		playButton.click();
		cy.wait(8000);
		cy.get("." + wordClasses.low).should("exist");
		playButton.click({force:true});
		cy.get("." + wordClasses.low).should("not.exist");
	});
});
