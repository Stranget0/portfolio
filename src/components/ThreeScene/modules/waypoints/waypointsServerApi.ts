import {
	foxWaypointCameraSpatial,
	foxWaypointTarget,
	foxWaypointStiffness,
} from "@components/ThreeScene/modules/waypoints/constants";
import createWaypoint from "@utils/elementWaypoints/elementWaypointsServerApi";

const foxWaypoints = {
	[foxWaypointCameraSpatial.key]: (...coords: [number, number, number]) =>
		createWaypoint<typeof coords>(foxWaypointCameraSpatial, ...coords),
	[foxWaypointTarget.key]: (...coords: [number, number, number]) =>
		createWaypoint<typeof coords>(foxWaypointTarget, ...coords),
	[foxWaypointStiffness.key]: (...coords: [number, number]) =>
		createWaypoint<typeof coords>(foxWaypointStiffness, ...coords),
};

export default foxWaypoints;
