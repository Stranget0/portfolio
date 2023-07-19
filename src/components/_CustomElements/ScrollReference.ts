import { scroll, animate, ScrollOptions, inView } from "motion";
import createCleanFunction from "@utils/createCleanFunction";
import { z } from "zod";

const defaultKeyframes = {
	transform: [0, 0.8, 1, 0.8, 0].map((scale) => `scale(${scale})`),
	opacity: [0, 0.3, 1, 0.3, 0],
};

export default class ScrollReference extends HTMLElement {
	targets: NodeListOf<HTMLElement> | null = null;
	targetsRef: NodeListOf<HTMLElement> | null = null;
	keyframes: Record<string, (string | number)[]>[] = [];

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
			const targetRef = targetsRef[i] || targetsRef[targetsRef.length - 1];

			if (!this.keyframes[i])
				this.keyframes.push(getKeyframesOfTarget(target) || defaultKeyframes);

			const keyframes = this.keyframes[i];

			const [offset1, offset2, offsetA, offsetB] =
				getOffsetFromTargetRef(targetRef);

			const options: ScrollOptions = {
				target: targetRef,
				offset: [
					`${offset1 || "start"} ${offsetA || "end"}`,
					`${offset2 || "end"} ${offsetB || "start"}`,
				],
			};

			const clean = scroll(
				animate(target, keyframes, { easing: "ease-out" }),
				options
			);

			this.cleanMenago.push(clean);
		}
	}

	disconnectedCallback() {
		this.cleanMenago.clean();
	}
}

function getOffsetFromTargetRef(ref: HTMLElement) {
	const { scrollRefOffsets = "" } = ref.dataset;
	return scrollRefOffsets.split(" ") as any[];
}

const keyframesSchema = z.record(z.array(z.union([z.string(), z.number()])));
function getKeyframesOfTarget(target: HTMLElement) {
	try {
		const { scrollTargetKeyframes = "" } = target.dataset;
		return keyframesSchema.parse(JSON.parse(scrollTargetKeyframes));
	} catch (e) {
		return undefined;
	}
}

customElements.define("scroll-reference", ScrollReference);
