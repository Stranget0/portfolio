export type WaypointData = [number, number, number];

// Element, offsetY, dataArray
export type WaypointTuple = [HTMLElement, number, WaypointData];

export type Waypoint = {
	attribute: `data-${string}`;
	key: string;
};

export type CreateWaypoint = (
	w: Waypoint,
	...coords: number[]
) => {
	[key: string]: string;
};
