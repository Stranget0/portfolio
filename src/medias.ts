import { availableBreakpoints } from "./constants";
import type { BreakpointsDict } from "./types";

export const breakpoints = availableBreakpoints.reduce((acc, b) => {
	acc[b] = matchMedia(`(min-width: ${b}px)`);
	return acc;
}, {} as BreakpointsDict);

export const pointerMedia = matchMedia("(pointer:fine)");
export const motionSafeMedia = matchMedia(
	"(prefers-reduced-motion: no-preference)",
);
