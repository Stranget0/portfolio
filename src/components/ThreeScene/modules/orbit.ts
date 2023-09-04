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
		smooth = true,
	) {
		const thetaTarget =
			initialSpherical.theta - thetaLeading + sphericalOffset.theta;
		const phiTarget = initialSpherical.phi - phiLeading + sphericalOffset.phi;

		sphericalTarget.theta = thetaTarget;
		sphericalTarget.phi = phiTarget;
		sphericalTarget.radius = initialSpherical.radius + sphericalOffset.radius;
		sphericalTarget.makeSafe();

		if (!isRunning() && smooth) startLerp(spherical, sphericalTarget, 0.02);
		else if (!isRunning()) {
			spherical.copy(sphericalTarget);
		}
	}
	function handleOrientation(event: DeviceOrientationEvent) {
		const roll = event.gamma;
		const pitch = event.beta;
		if (roll === null || pitch === null) return;

		initialRoll ||= roll;
		initialPitch ||= pitch;

		const rolldiff = initialRoll - roll;
		const pitchdiff = initialPitch - pitch;

		thetaLeading = rolldiff / 90 / stiffness.x;
		phiLeading = pitchdiff / 90 / stiffness.y;

		startPositionLerp(thetaLeading, phiLeading);
	}
	function handlePointerMove(e: MouseEvent | TouchEvent) {
		const isTouch = "touches" in e;
		const x = isTouch ? e.touches[0].clientX : e.clientX;
		const y = isTouch ? e.touches[0].clientY : e.clientY;
		thetaLeading = mouseDToSphericalD(x, window.innerWidth) / 12 / stiffness.x;
		phiLeading = mouseDToSphericalD(y, window.innerHeight) / 12 / stiffness.y;

		startPositionLerp(thetaLeading, phiLeading);
	}

	function removeMouseMoveIfDeviceOrientation({
		gamma,
		beta,
		alpha,
	}: DeviceOrientationEvent): void {
		if ([gamma, beta, alpha].every((v) => v !== null)) {
			removeEventListener("mousemove", handlePointerMove);
			removeEventListener("touchmove", handlePointerMove);
		}
	}

	let thetaLeading = 0;
	let phiLeading = 0;
	let initialRoll: number;
	let initialPitch: number;
	const camera = controller.camera;
	const target = new Vector3();
	const spherical = new SphericalLerpable(0);
	const initialSpherical = spherical.clone();
	const sphericalTarget = spherical.clone();
	const sphericalOffset = new Spherical(0);
	const stiffness = { x: 1, y: 1 };

	camera.lookAt(target);

	const { startLerp, isRunning } = initLerpPositions(updateCameraPosition);

	addEventListener("mousemove", handlePointerMove);
	addEventListener("touchmove", handlePointerMove);

	addEventListener("deviceorientation", removeMouseMoveIfDeviceOrientation, {
		once: true,
	});
	addEventListener("deviceorientation", handleOrientation);

	controller.onDestroy(() => {
		removeEventListener("mousemove", handlePointerMove);
		removeEventListener("deviceorientation", handleOrientation);
	});

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
