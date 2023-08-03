import {
	classInViewAttr,
	classInViewContainerAttr,
	classInViewDataKey,
} from "./constants";

const parentToTargets = new WeakMap<HTMLElement, HTMLElement[]>();

const intersectionObserver = new IntersectionObserver(
	(observerEntries) => {
		for (const { target: parent, isIntersecting } of observerEntries) {
			const targets = getTargets(parent as HTMLElement);
			targets.forEach(isIntersecting ? toggleTargetOn : toggleTargetOff);
		}
	},
	{ root: null, threshold: 1 }
);

for (const toBeObserved of document.querySelectorAll(
	`[${classInViewContainerAttr}]`
)) {
	intersectionObserver.observe(toBeObserved);
}

function getTargets(parent: HTMLElement): HTMLElement[] {
	const cached = parentToTargets.get(parent);
	if (cached) {
		return cached;
	}

	const targets = Array.from(
		parent.querySelectorAll<HTMLElement>(`[${classInViewAttr}]`)
	);

	// Cache
	parentToTargets.set(parent, targets);
	return targets;
}

function toggleTargetOn(target: HTMLElement): void {
	const className = getToggledClassName(target);

	const isAnimation = className.includes("animate-");
	const hasClassName = target.classList.contains(className);
	if (isAnimation && hasClassName) {
		target.classList.remove(className);
		// trigger reflow to restart animation
		void target.offsetWidth;
	} else if (hasClassName) return;

	target.classList.add(className);
}

function toggleTargetOff(target: HTMLElement): void {
	const className = getToggledClassName(target);
	target.classList.remove(className);
}

function getToggledClassName(target: HTMLElement): string {
	return target.dataset[classInViewDataKey] || "";
}
