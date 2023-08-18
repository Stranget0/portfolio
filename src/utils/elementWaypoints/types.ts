import type { AvailableBreakpoints } from "@/constants";

export type WaypointData = number[];

// Element, offsetY, dataArray
export type WaypointTuple = [HTMLElement, number, WaypointData];

export type Waypoint = {
	attribute: `data-${string}`;
	key: string;
};

export type CreateWaypoint<C extends number[]> = (
	minWidth: Waypoint,
	...coords: C
) => {
	addBreakpoint: (
		w: AvailableBreakpoints,
		...coords: C
	) => ReturnType<CreateWaypoint<C>>;
	waypoint: () => { [key: string]: string };
};
