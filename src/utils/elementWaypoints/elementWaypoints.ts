import type ThreeController from "@utils/ThreeController";
import initLerpPositions from "@utils/lerpPositions";
import { scroll } from "motion";
import type { WaypointTuple, Waypoint } from "./types";
import { Vector3 } from "three";

export default function elementWaypoints(
	controller: ThreeController,
	{ attribute, key }: Waypoint
) {
	const p = new Vector3();
	const q = new Vector3();
	return {
		setWaypointTarget(onUpdate?: (newTarget: Vector3) => void) {
			const lerpVector = new Vector3();
			const waypointsElements = getDataElements(attribute);
			const waypoints = handleWaypoints(controller, waypointsElements, key);
			const getPAndQWaypoints = createWaypointPQGetter();
			let hasScrolled = false;

			const { startLerp } = initLerpPositions(() => {
				onUpdate?.(lerpVector);
			});

			function transitionToNewPosition(current: number, smooth = true) {
				const { waypoint, nextWaypoint } = getPAndQWaypoints(
					waypoints,
					current
				);
				if (waypoint) {
					setPointBetweenToP(waypoint, nextWaypoint, current);
					if (smooth) startLerp(lerpVector, p);
					else onUpdate?.(lerpVector.copy(p));
				}
			}
			scroll(({ y }) => {
				if (!y.velocity && hasScrolled) return;
				transitionToNewPosition(y.current, hasScrolled);
				hasScrolled = true;
			});

			function setPointBetweenToP(
				waypoint: WaypointTuple,
				nextWaypoint: WaypointTuple,
				current: number
			) {
				p.set(...(waypoint[2] as [number, number, number]));

				if (nextWaypoint) {
					q.set(...(nextWaypoint[2] as [number, number, number]));

					const progressBetweenWaypoints =
						(current - waypoint[1]) / (nextWaypoint[1] - waypoint[1]);

					p.lerp(q, progressBetweenWaypoints);
				}
			}
		},
	};
}

export type ElementWaypointInitReturnType = ReturnType<typeof elementWaypoints>;

function handleOnResize(controller: ThreeController, onResize: VoidFunction) {
	window.addEventListener("resize", onResize);
	const clean = () => window.removeEventListener("resize", onResize);
	controller.onDestroy(clean);
}

function handleWaypoints(
	controller: ThreeController,
	waypointElements: NodeListOf<HTMLElement>,
	datasetKey: string
) {
	const waypoints: WaypointTuple[] = [];
	for (const element of waypointElements) {
		const waypointBreakpoints = readBreakpoints(element, datasetKey);
		const waypointData = calculateBreakpoints(waypointBreakpoints);

		const waypoint = [
			element,
			element.offsetTop,
			waypointData,
		] as WaypointTuple;

		waypoints.push(waypoint);

		handleOnResize(controller, () => {
			waypoint[1] = waypoint[0].offsetTop;
			if (waypointBreakpoints.length > 1)
				waypoint[2] = calculateBreakpoints(waypointBreakpoints);
		});
	}

	sortWaypoints(waypoints);

	handleOnResize(controller, () => {
		sortWaypoints(waypoints);
	});

	return waypoints;
}

function getDataElements(dataStr: string) {
	return document.querySelectorAll<HTMLElement>(`[${dataStr}]`);
}

function readBreakpoints(element: HTMLElement, datasetKey: string) {
	const data = element.dataset[datasetKey];
	const waypointBreakpoints =
		data
			?.split(";")
			?.map((g) => g.split(" "))
			.map((g) => g.map((str) => parseFloat(str))) || [];
	return waypointBreakpoints;
}

function calculateBreakpoints(waypointBreakpoints: number[][]) {
	const winnerWaypoint = waypointBreakpoints.reduce((acc, w, i) => {
		if (i === 0) return w;
		const [breakpoint, ...coords] = w;
		const breakpointMedia = matchMedia(`(min-width: ${breakpoint}px)`);
		if (breakpointMedia.matches) return coords;
		return acc;
	}, [] as number[]);

	return winnerWaypoint;
}

function sortWaypoints(waypoints: WaypointTuple[]) {
	waypoints.sort(([_w1, top1], [_w2, top2]) => top1 - top2);
}

function createWaypointPQGetter() {
	let waypointIndex = 0;
	return function getWaypointPQ(waypoints: WaypointTuple[], current: number) {
		waypointIndex = waypoints.findLastIndex(
			([_w, offsetTop]) => current - offsetTop > 0
		);
		if (waypointIndex === -1) waypointIndex = 0;

		const waypoint = waypoints[waypointIndex];
		const nextWaypoint = waypoints[waypointIndex + 1];

		return { waypoint, nextWaypoint };
	};
}
