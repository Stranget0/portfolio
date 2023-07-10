import type ThreeController from "./ThreeController";
import initLerpPositions from "./lerpPositions";
import SphericalLerpable from "./SphericalLerpable";
import { AxesHelper, Spherical, Vector3 } from "three";

type NumTuple = readonly [number, number, number];

export default function initOrbit(
	controller: ThreeController,
	initialPosition: NumTuple = [0, 0, 0],
	lookAtTarget: NumTuple = [0, 0, 0]
) {
	function updateCameraPosition() {
		camera.position.setFromSpherical(spherical).add(positionOffset);
		camera.lookAt(target);
	}

	const helper1 = new AxesHelper(0.3);
	controller.scene.add(helper1);

	const camera = controller.camera;
	const absInitialCamPos = new Vector3(...initialPosition);
	const spherical = new SphericalLerpable().setFromVector3(absInitialCamPos);
	const initialSpherical = spherical.clone();
	const sphericalTarget = spherical.clone();
	const positionOffset = new Vector3();
	const sphericalOffset = new Spherical(0);

	const targetAbs = new Vector3(...lookAtTarget);
	const target = targetAbs.clone();
	camera.lookAt(target);

	const { startLerp } = initLerpPositions(updateCameraPosition);

	addEventListener("mousemove", handleMouseMove);
	controller.onDestroy(() => removeEventListener("mousemove", handleMouseMove));

	function handleMouseMove(e: MouseEvent) {
		const thetaLeading = mouseDToSphericalD(e.clientX, window.innerWidth);
		const phiLeading = mouseDToSphericalD(e.clientY, window.innerHeight);

		const thetaTarget =
			initialSpherical.theta - thetaLeading / 12 + sphericalOffset.theta;
		const phiTarget =
			initialSpherical.phi - phiLeading / 12 + sphericalOffset.phi;

		sphericalTarget.theta = thetaTarget;
		sphericalTarget.phi = phiTarget;
		sphericalTarget.radius = initialSpherical.radius + sphericalOffset.radius;
		sphericalTarget.makeSafe();

		startLerp(spherical, sphericalTarget);
	}

	return {
		target: targetAbs,
		setLookAtOffset(vec: Vector3) {
			target.addVectors(targetAbs, vec);
			helper1.position.copy(target);
			camera.lookAt(target);
		},
		setCameraOffset(vec: Vector3) {
			positionOffset.copy(vec);
			updateCameraPosition();
		},
		setCameraSpatialOffset(sph: Spherical) {
			sphericalOffset.copy(sph);
			updateCameraPosition();
		},
	};
}

function mouseDToSphericalD(mousePosD: number, max: number) {
	return (mousePosD / max - 0.5) * 2 * Math.PI;
}
