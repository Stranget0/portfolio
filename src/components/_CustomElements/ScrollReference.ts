import { scroll, animate, ScrollOptions, inView } from "motion";
import createCleanFunction from "@utils/createCleanFunction";

export default class ScrollReference extends HTMLElement {
	targets: NodeListOf<HTMLElement> | null = null;
	targetsRef: NodeListOf<HTMLElement> | null = null;
	constructor() {
		super();
	}
	cleanMenago = createCleanFunction();
	connectedCallback() {
		if (!this.isConnected) return;
		inView(this, () => {
			const { scrollFeatureRefs } = this.dataset;
			if (typeof scrollFeatureRefs !== "undefined") this.handleTargetsWithRef();
			return this.cleanMenago.clean;
		});
	}

	private handleTargetsWithRef() {
		const targets =
			this.targets ||
			this.querySelectorAll<HTMLElement>("[data-scroll-target]");
		const targetsRef =
			this.targetsRef ||
			this.querySelectorAll<HTMLElement>("[data-scroll-target-ref]");
		this.targets = targets;
		this.targetsRef = targetsRef;

		for (let i = 0; i < targets.length; i++) {
			const target = targets[i];
			const targetRef = targetsRef[i];
			if (!targetRef) break;

			const options: ScrollOptions = {
				target: targetRef,
				offset: [`start 0.7`, `end 0.3`],
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
