import type { Target } from "../plugins/lerpScroll/initLerpScroll";

export function getMaxPos(target: Target, direction: "x" | "y"): number {
	const d = direction === "x" ? "Width" : "Height";
	let container;
	if (target instanceof Window) container = document.documentElement;
	else container = target;
	return container[`scroll${d}`] - container[`client${d}`];
}
