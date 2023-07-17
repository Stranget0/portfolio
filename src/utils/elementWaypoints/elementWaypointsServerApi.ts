import chunk from "lodash/chunk";
import type { CreateWaypoint } from "./types";

export default function createWaypoint<C extends number[]>(
	{ attribute }: Parameters<CreateWaypoint<C>>[0],
	...coords: C
): ReturnType<CreateWaypoint<C>> {
	const breakpoints: number[] = [];

	const res: ReturnType<CreateWaypoint<C>> = {
		addBreakpoint(...breakpointData) {
			breakpoints.push(...breakpointData);
			return res;
		},
		waypoint: () => {
			const additionalData = chunk(
				breakpoints,
				Array.from(coords).length + 1
			).map((b) => b.join(" "));

			const mediaGroups = [coords.join(" "), ...additionalData];

			return {
				[attribute]: mediaGroups.join(";"),
			};
		},
	};

	return res;
}
