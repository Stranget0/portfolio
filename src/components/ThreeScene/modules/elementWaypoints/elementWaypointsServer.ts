import { separator } from "./constants";
import type { CreateWaypoint } from "./types";

export const createWaypoint: CreateWaypoint = ({ attribute }, ...cords) => ({
	[attribute]: cords.join(separator),
});
