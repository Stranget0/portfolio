import { scroll, animate, ScrollOptions } from "motion";
import createCleanFunction from "@utils/createCleanFunction";

export default class ScrollReference extends HTMLElement {
	constructor() {
		super();
	}
	cleanMenago = createCleanFunction();
	connectedCallback() {
		if (!this.isConnected) return;

		const targets = this.querySelectorAll<HTMLElement>("[data-scroll-target]");
		const targetsRef = this.querySelectorAll<HTMLElement>(
			"[data-scroll-target-ref]"
		);

		for (let i = 0; i < targets.length; i++) {
			const target = targets[i];
			const targetRef = targetsRef[i];
			const options: ScrollOptions = {
				target: targetRef,
				offset: [`start end`, `start 0.5`],
			};
			const clean = scroll(
				animate(
					target,
					{ scale: [0, 1, 0], opacity: [0, 1, 0] },
					{ easing: "ease-in-out" }
				),
				options
			);
			this.cleanMenago.push(clean);
		}
	}
	disconnectedCallback() {
		this.cleanMenago.clean();
	}
}

customElements.define("scroll-reference", ScrollReference);
