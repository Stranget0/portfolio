import type ThreeController from "@utils/ThreeController";
import {
	foxWaypointCamera,
	foxWaypointCameraSpatial,
	foxWaypointTarget,
} from "./constants";

export function elementWaypointsInit(controller: ThreeController) {
	return {
		elementWaypoints: import("./elementWaypoints").then(
			({ default: elementWaypoints }) => ({
				[foxWaypointTarget.key]: elementWaypoints(
					controller,
					foxWaypointTarget
				),
				[foxWaypointCamera.key]: elementWaypoints(
					controller,
					foxWaypointCamera
				),
				[foxWaypointCameraSpatial.key]: elementWaypoints(
					controller,
					foxWaypointCameraSpatial
				),
			})
		),
	};
}
