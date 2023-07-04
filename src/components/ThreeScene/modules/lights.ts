import type ThreeController from "@utils/ThreeController";

export default function lights(controller: ThreeController) {
	return {
		lights: import("../initLights").then(({ default: initLights }) =>
			initLights(controller)
		),
	};
}
