import type { availableBreakpoints } from "./constants";

export interface Tab {
	id: string;
	label: string;
}
export interface Tabs {
	[k: string]: Tab;
}
export type AvailableBreakpoints = (typeof availableBreakpoints)[number];

export type BreakpointsDict = Record<
	(typeof availableBreakpoints)[number],
	MediaQueryList
>;
