import type { Waypoint } from "./types";

export const separator = " ";

export const foxWaypointTarget = {
	attribute: "data-fox-waypoint-target",
	key: "foxWaypointTarget",
} as const satisfies Waypoint;

export const foxWaypointCameraSpatial = {
	attribute: "data-fox-waypoint-camera-spatial",
	key: "foxWaypointCameraSpatial",
} as const satisfies Waypoint;

export const foxWaypointStiffness = {
	attribute: "data-fox-waypoint-stiffness",
	key: "foxWaypointStiffness",
} as const satisfies Waypoint;

export const waypoints = [
	foxWaypointTarget,
	foxWaypointCameraSpatial,
	foxWaypointStiffness,
] as const;
