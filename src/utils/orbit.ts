import { Vector3 } from "three";
import type ThreeController from "./ThreeController";
import initLerpPositions from "./lerpObjects";
import SphericalLerpable from "./SphericalLerpable";

export default function initOrbit(
	controller: ThreeController,
	lookAtTarget = new Vector3(0, 0, 0)
) {
	const camera = controller.camera;
	const absInitialCamPos = camera.position.clone();
	const spherical = new SphericalLerpable().setFromVector3(absInitialCamPos);
	const initialSpherical = spherical.clone();
	const sphericalTarget = spherical.clone();

	addEventListener("mousemove", handleMouseMove);

	const { startLerp } = initLerpPositions(() => {
		camera.position.setFromSpherical(spherical);
		camera.lookAt(lookAtTarget);
		controller.render();
	});

	function handleMouseMove(e: MouseEvent) {
		const thetaLeading = mouseDToSphericalD(e.clientX, window.innerWidth);
		const phiLeading = mouseDToSphericalD(e.clientY, window.innerHeight);

		const thetaTarget = initialSpherical.theta - thetaLeading / 12;
		const phiTarget = initialSpherical.phi - phiLeading / 12;

		sphericalTarget.theta = thetaTarget;
		sphericalTarget.phi = phiTarget;
		sphericalTarget.makeSafe();

		startLerp(spherical, sphericalTarget);
	}
}

function mouseDToSphericalD(mousePosD: number, max: number) {
	return (mousePosD / max - 0.5) * 2 * Math.PI;
}
