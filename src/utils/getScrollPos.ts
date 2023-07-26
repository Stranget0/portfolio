import type { Target } from "../plugins/lerpScroll/initLerpScroll";

export function getScrollPos(target: Target, d: "x" | "y"): number {
	const map = {
		window: { x: "scrollX", y: "scrollY" },
		default: { x: "scrollTop", y: "scrollLeft" },
	} as const;

	if (target instanceof Window) {
		return target[map.window[d]];
	}
	return target[map.default[d]];
}
