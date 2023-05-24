import { Vector2, Spherical, Vector3 } from "three";
import type ThreeController from "./ThreeController";
import { clamp } from "three/src/math/MathUtils";

export default function initOrbit(
	controller: ThreeController,
	target = new Vector3(0, 0, 0)
) {
	const initialPos = controller.camera.position.clone();
	const rotateStart = new Vector2();
	const rotateDelta = new Vector2();
	const rotateEnd = new Vector2();
	const sphericalDelta = new Spherical();
	const spherical = new Spherical();

	function rotateLeft(angle: number) {
		sphericalDelta.theta -= angle;
	}

	function rotateUp(angle: number) {
		sphericalDelta.phi -= angle;
	}

	const offset = new Vector3(0, 0, 0);

	addEventListener("mousemove", handleMouseMove);

	function handleMouseMove(e: MouseEvent) {
		rotateEnd.set(e.clientX, e.clientY);

		rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(1);

		rotateLeft((2 * Math.PI * rotateDelta.x) / window.innerWidth);

		rotateUp((2 * Math.PI * rotateDelta.y) / window.innerHeight);

		// ****************************************

		const position = controller.camera.position;
		offset.copy(position).sub(target);

		spherical.setFromVector3(offset);
		spherical.theta += sphericalDelta.theta;
		spherical.phi += sphericalDelta.phi;

		rotateStart.copy(rotateEnd);

		spherical.makeSafe();

		offset.setFromSpherical(spherical);

		const placeToMove = target.clone().add(offset);
		const lerpFactor = clamp(1 - initialPos.distanceTo(placeToMove), 0, 1) / 50;
		position.lerp(placeToMove, lerpFactor);
		controller.camera.lookAt(target);

		controller.render();

		sphericalDelta.set(0, 0, 0);
	}
}
