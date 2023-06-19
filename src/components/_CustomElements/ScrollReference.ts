import { scroll, animate, ScrollOptions } from "motion";
import createCleanFunction from "@utils/createCleanFunction";

export default class ScrollReference extends HTMLElement {
	constructor() {
		super();
	}
	cleanMenago = createCleanFunction();
	connectedCallback() {
		if (!this.isConnected) return;
		const { scrollFeatureRefs } = this.dataset;
		if (typeof scrollFeatureRefs !== "undefined") this.handleTargetsWithRef();
	}
	private handleTargetsWithRef() {
		const targets = this.querySelectorAll<HTMLElement>("[data-scroll-target]");
		const targetsRef = this.querySelectorAll<HTMLElement>(
			"[data-scroll-target-ref]"
		);
		for (let i = 0; i < targets.length; i++) {
			const target = targets[i];
			const targetRef = targetsRef[i];
			if (!targetRef) break;

			const options: ScrollOptions = {
				target: targetRef,
				offset: [`start end`, `start 0.5`],
			};

			const clean = scroll(
				animate(
					target,
					{ scale: [0, 0.8, 1, 0.8, 0], opacity: [0, 0.3, 1, 0.3, 0] },
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
