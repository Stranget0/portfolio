import type ThreeController from "@utils/ThreeController";

export default function fog(controller: ThreeController) {
	return {
		fog: import("../initFog").then(({ default: initFog }) =>
			initFog(controller)
		),
	};
}
