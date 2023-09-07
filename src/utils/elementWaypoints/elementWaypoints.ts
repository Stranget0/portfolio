import type ThreeController from "@utils/ThreeController";
import initLerpPositions from "@utils/lerpPositions";
import { scroll } from "motion";
import type { WaypointTuple, Waypoint } from "./types";
import { Vector3 } from "three";
import { breakpoints } from "@/medias";
import type { AvailableBreakpoints } from "@/types";
import createCleanFunction from "../createCleanFunction";
import runOnEachPage from "../runOnEachPage";

export default function elementWaypoints(
	controller: ThreeController,
	{ attribute, key }: Waypoint,
) {
	const p = new Vector3();
	const q = new Vector3();
	let updateListeners: VoidFunction[] = [];

	const cleanMenago = createCleanFunction(() => {
		updateListeners = [];
	});

	controller.onDestroy(() => {
		cleanMenago.clean();
	});

	return {
		updateWaypointPosition() {
			runUpdateListeners();
		},
		setWaypointTarget(onUpdate?: (newTarget: Vector3) => void) {
			cleanMenago.clean();
			window.addEventListener("resize", runUpdateListeners);
			cleanMenago.push(() =>
				window.removeEventListener("resize", runUpdateListeners),
			);

			const getPAndQWaypoints = createWaypointPQGetter();
			const lerpVector = new Vector3();
			let hasScrolled = false;
			const { startLerp } = initLerpPositions(() => {
				onUpdate?.(lerpVector);
			});
			let waypoints: WaypointTuple[] | null = null;
			controller.isLooping.listeners.push((isLooping) =>
				onIsLooping(isLooping),
			);

			runOnUpdate(() => waypoints && transitionToNewPosition(waypoints));

			runOnEachPage(() => {
				const waypointsElements = getDataElements(attribute);
				waypoints = handleWaypoints(waypointsElements, key);
			});

			function onIsLooping(isLooping: boolean) {
					if (!isLooping) {
						cleanMenago.clean();
						return;
					}

					cleanMenago.push(
						scroll(({ y }) => {
							if (!y.velocity && hasScrolled) return;

							waypoints && transitionToNewPosition(waypoints, y.current, hasScrolled);
							hasScrolled = true;
						}),
					);
			}
			function transitionToNewPosition(
				waypoints: WaypointTuple[],
				current = window.scrollY,
				smooth = true,
			) {
				const { waypoint, nextWaypoint } = getPAndQWaypoints(
					waypoints,
					current,
				);
				if (waypoint) {
					setPointBetweenToP(waypoint, nextWaypoint, current);
					if (smooth) startLerp(lerpVector, p);
					else onUpdate?.(lerpVector.copy(p));
				}
			}
			function setPointBetweenToP(
				waypoint: WaypointTuple,
				nextWaypoint: WaypointTuple,
				current: number,
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

	function runUpdateListeners() {
		updateListeners.forEach((l) => l());
	}

	function runOnUpdate(onUpdate: VoidFunction) {
		updateListeners.push(onUpdate);
	}
	function handleWaypoints(
		waypointElements: NodeListOf<HTMLElement>,
		datasetKey: string,
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

			runOnUpdate(() => {
				waypoint[1] = waypoint[0].offsetTop;
				if (waypointBreakpoints.length > 1)
					waypoint[2] = calculateBreakpoints(waypointBreakpoints);
			});
		}

		sortWaypoints(waypoints);

		runOnUpdate(() => {
			sortWaypoints(waypoints);
		});

		return waypoints;
	}
}

export type ElementWaypointInitReturnType = ReturnType<typeof elementWaypoints>;

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

		const breakpointMedia = breakpoints[breakpoint as AvailableBreakpoints];
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
			([_w, offsetTop]) => current - offsetTop > 0,
		);
		if (waypointIndex === -1) waypointIndex = 0;

		const waypoint = waypoints[waypointIndex];
		const nextWaypoint = waypoints[waypointIndex + 1];

		return { waypoint, nextWaypoint };
	};
}
