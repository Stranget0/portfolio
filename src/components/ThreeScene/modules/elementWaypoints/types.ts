export type WaypointData = number[];
export type WaypointTuple = [HTMLElement, number, WaypointData];

export type Waypoint = {
	attribute: `data-${string}`;
	key: string;
};
export type CreateWaypoint = (
	w: Waypoint,
	...coords: WaypointData
) => {
	[key: string]: string;
};
