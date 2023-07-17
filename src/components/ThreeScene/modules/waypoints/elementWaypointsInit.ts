import type ThreeController from "@utils/ThreeController";
import { waypoints } from "./constants";
import type { ElementWaypointInitReturnType } from "../../../../utils/elementWaypoints/elementWaypoints";

export default function elementWaypointsInit(controller: ThreeController) {
	return {
		elementWaypoints: import("@utils/elementWaypoints/elementWaypoints").then(
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
