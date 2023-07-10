import type ThreeController from "@utils/ThreeController";
import { foxWaypointCameraSpatial, foxWaypointTarget } from "./constants";

export function elementWaypointsInit(controller: ThreeController) {
	return {
		elementWaypoints: import("./elementWaypoints").then(
			({ default: elementWaypoints }) => ({
				[foxWaypointTarget.key]: elementWaypoints(
					controller,
					foxWaypointTarget
				),
				[foxWaypointCameraSpatial.key]: elementWaypoints(
					controller,
					foxWaypointCameraSpatial
				),
			})
		),
	};
}
