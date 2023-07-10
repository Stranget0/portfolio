import type ThreeController from "@utils/ThreeController";
import initLerpPositions from "@utils/lerpPositions";
import { scroll } from "motion";
import type { WaypointTuple, WaypointData, Waypoint } from "./types";
import { Vector3 } from "three";
import { separator } from "./constants";

export default function elementWaypoints(
	controller: ThreeController,
	{ attribute, key }: Waypoint
) {
	return {
		setWaypointTarget(onUpdate?: (newTarget: Vector3) => void) {
			const lerpVector = new Vector3();
			const waypoints = getWaypoints(attribute, key, separator);
			handleOnResize(waypoints, controller);
			const { startLerp } = initLerpPositions(() => {
				onUpdate?.(lerpVector);
			});
			let waypointIndex = 0;

			scroll(({ y }) => {
				waypointIndex = waypoints.findLastIndex(
					([_w, offsetTop]) => y.current - offsetTop > 0
				);
				if (waypointIndex === -1) waypointIndex = 0;

				const waypoint = waypoints[waypointIndex];
				const nextWaypoint = waypoints[waypointIndex + 1];

				if (nextWaypoint && waypoint) {
					const p = new Vector3(...waypoint[2]);
					const q = new Vector3(...nextWaypoint[2]);

					const progressBetweenWaypoints =
						(y.current - waypoint[1]) / (nextWaypoint[1] - waypoint[1]);

					const to = p.lerp(q, progressBetweenWaypoints);

					startLerp(lerpVector, to);
				}
			});
		},
	};
}

function handleOnResize(
	waypoints: WaypointTuple[],
	controller: ThreeController
) {
	function onResize() {
		waypoints.forEach((w) => (w[1] = w[0].offsetTop));
		sortWaypoints(waypoints);
	}

	document.addEventListener("resize", onResize);
	const clean = () => document.removeEventListener("resize", onResize);
	controller.onDestroy(clean);
}

function getWaypoints(dataStr: string, datasetKey: string, separator: string) {
	const waypoints: WaypointTuple[] = [];
	for (const element of document.querySelectorAll<HTMLElement>(
		`[${dataStr}]`
	)) {
		const waypointData = element.dataset[datasetKey]
			?.split(separator)
			.map((strNum) => parseFloat(strNum));

		waypoints.push([element, element.offsetTop, waypointData as WaypointData]);
	}

	sortWaypoints(waypoints);
	return waypoints;
}

function sortWaypoints(waypoints: WaypointTuple[]) {
	waypoints.sort(([_w1, top1], [_w2, top2]) => top1 - top2);
}
