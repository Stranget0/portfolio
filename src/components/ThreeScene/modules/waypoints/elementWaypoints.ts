import type ThreeController from "@utils/ThreeController";
import { waypoints } from "./constants";
import type { ElementWaypointInitReturnType } from "@utils/elementWaypoints/elementWaypoints";
import elementWaypoints from "@utils/elementWaypoints/elementWaypoints";

export default function elementWaypointsInit(controller: ThreeController) {
	const waypointControls = {
		updateWaypointsPositions() {
			Object.values(this.waypoints).forEach(({ updateWaypointPosition }) => {
				updateWaypointPosition();
			});
		},
		waypoints: waypoints.reduce(
			(acc, waypoint) => ({
				...acc,
				[waypoint.key]: elementWaypoints(controller, waypoint),
			}),
			{} as {
				[k in (typeof waypoints)[number]["key"]]: ElementWaypointInitReturnType;
			},
		),
	};
	
	return waypointControls;
}
