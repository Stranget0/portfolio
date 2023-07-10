import type ThreeController from "@utils/ThreeController";
import { initialCameraPosition } from "../constants";

export default function orbit(controller: ThreeController) {
	return {
		orbit: import("@utils/orbit").then(({ default: initOrbit }) => {
			const cameraTarget = [0.5, -0.3, -1] as const;
			return initOrbit(controller, initialCameraPosition, cameraTarget);
		}),
	};
}
