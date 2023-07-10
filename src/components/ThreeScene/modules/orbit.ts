import type ThreeController from "@utils/ThreeController";

export default function orbit(controller: ThreeController) {
	return {
		orbit: import("@utils/orbit").then(({ default: initOrbit }) => {
			return initOrbit(controller);
		}),
	};
}
