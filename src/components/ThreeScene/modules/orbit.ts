import type ThreeController from "@utils/ThreeController";

export default function orbit(controller: ThreeController) {
	return {
		orbit: import("@utils/orbit").then(({ default: initOrbit }) => {
			const camera = controller.camera;
			camera.position.set(-1, 1, 3);
			const cameraTarget = [0.5, -0.3, -1] as const;
			camera.lookAt(...cameraTarget);
			const cleanOrbit = initOrbit(controller, cameraTarget);
			controller.onDestroy(cleanOrbit);
		}),
	};
}
