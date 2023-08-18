import type ThreeController from "@utils/ThreeController";
import initLerpPositions from "@utils/lerpPositions";
import SphericalLerpable from "@utils/SphericalLerpable";
import { Spherical, Vector3 } from "three";

export default function orbit(controller: ThreeController) {
	function updateCameraPosition() {
		camera.position.setFromSpherical(spherical);
		camera.lookAt(target);
	}
	function startPositionLerp(
		thetaLeading: number,
		phiLeading: number,
		smooth = true
	) {
		const thetaTarget =
			initialSpherical.theta - thetaLeading + sphericalOffset.theta;
		const phiTarget = initialSpherical.phi - phiLeading + sphericalOffset.phi;

		sphericalTarget.theta = thetaTarget;
		sphericalTarget.phi = phiTarget;
		sphericalTarget.radius = initialSpherical.radius + sphericalOffset.radius;
		sphericalTarget.makeSafe();

		if (!isRunning() && smooth) startLerp(spherical, sphericalTarget);
		else if (!isRunning()) {
			spherical.copy(sphericalTarget);
		}
	}

	let thetaLeading = 0;
	let phiLeading = 0;
	const camera = controller.camera;
	const target = new Vector3();
	const spherical = new SphericalLerpable(0);
	const initialSpherical = spherical.clone();
	const sphericalTarget = spherical.clone();
	const sphericalOffset = new Spherical(0);
	const stiffness = { x: 1, y: 1 };

	camera.lookAt(target);

	const { startLerp, isRunning } = initLerpPositions(
		updateCameraPosition,
		0.01
	);

	addEventListener("mousemove", handleMouseMove);
	controller.onDestroy(() => removeEventListener("mousemove", handleMouseMove));

	function handleMouseMove(e: MouseEvent) {
		thetaLeading =
			mouseDToSphericalD(e.clientX, window.innerWidth) / 12 / stiffness.x;
		phiLeading =
			mouseDToSphericalD(e.clientY, window.innerHeight) / 12 / stiffness.y;

		startPositionLerp(thetaLeading, phiLeading);
	}

	return {
		orbit: {
			stiffness,
			setLookAtOffset(vec: Vector3) {
				target.copy(vec);
				camera.lookAt(target);
			},
			setCameraSpatial(vec: Vector3, smooth = true) {
				sphericalOffset.set(...vec.toArray());
				startPositionLerp(thetaLeading, phiLeading, smooth);
			},
		},
	};
}

function mouseDToSphericalD(mousePosD: number, max: number) {
	return (mousePosD / max - 0.5) * 2 * Math.PI;
}
