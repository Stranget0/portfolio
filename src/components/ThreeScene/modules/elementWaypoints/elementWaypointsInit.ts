import type ThreeController from "@utils/ThreeController";
import { waypoints } from "./constants";
import type { ElementWaypointInitReturnType } from "./elementWaypoints";

export function elementWaypointsInit(controller: ThreeController) {
	return {
		elementWaypoints: import("./elementWaypoints").then(
			({ default: elementWaypoints }) =>
				waypoints.reduce(
					(acc, waypoint) => ({
						...acc,
						[waypoint.key]: elementWaypoints(controller, waypoint),
					}),
					{} as {
						[k in (typeof waypoints)[number]["key"]]: ElementWaypointInitReturnType;
					}
				)
		),
	};
}
