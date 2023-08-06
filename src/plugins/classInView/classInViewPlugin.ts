import { inView } from "motion";
import {
	classInViewAttr,
	classInViewDataKey,
	classInViewWorkaroundDataKey,
	classInViewThresholdDataKey,
} from "./constants";
import isInViewport from "@/utils/isInViewport";
import getUserAgent from "@/utils/getUserAgent";

const isEdge = getUserAgent() === "edge";
const targets = document.querySelectorAll<HTMLElement>(`[${classInViewAttr}]`);

for (const target of targets) {
	const threshold = parseInt(target.dataset[classInViewThresholdDataKey] || "");
	if (!isInViewport(target)) toggleTargetOff(target);

	inView(
		target,
		() => {
			toggleTargetOn(target);
			return () => toggleTargetOff(target);
		},
		{ amount: Number.isNaN(threshold) ? 0 : threshold }
	);
}

function toggleTargetOn(target: HTMLElement): void {
	const [outClass, inClass] = getToggledClassName(target);

	const isAnimation = inClass.some((c) => c.includes("animate-"));
	const hasClassName = inClass.every((c) => target.classList.contains(c));
	if (isAnimation && hasClassName) {
		target.classList.remove(...inClass);
		// trigger reflow to restart animation
		void target.offsetWidth;
	} else if (hasClassName) return;
	switchClasses(target, outClass, inClass);
}

function toggleTargetOff(target: HTMLElement): void {
	const isWorkaround = classInViewWorkaroundDataKey in target.dataset;

	if (isWorkaround && isEdge && isInViewport(target)) return;
	const [outClass, inClass] = getToggledClassName(target);
	switchClasses(target, inClass, outClass);
}

function getToggledClassName(target: HTMLElement): string[][] {
	return (
		target.dataset[classInViewDataKey]
			?.split(";")
			.map((str) => str.trim().split(" ")) || [[], []]
	);
}

function switchClasses(
	target: HTMLElement,
	classesToRemove: string[],
	classesToAdd: string[]
) {
	try {
		if (classesToRemove.some((c) => c))
			target.classList.remove(...classesToRemove);
		if (classesToAdd.some((c) => c)) target.classList.add(...classesToAdd);
	} catch (e) {
		console.error({ outClass: classesToRemove, inClass: classesToAdd }, e);
	}
}
