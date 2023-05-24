import { Spherical, Vector3 } from "three";
import randomBetween from "./randomFloat";

export default function randomSpherePointsFromTo(
	count: number,
	radiusFrom: number,
	radiusTo: number,
	randomFn = Math.random
) {
	const points: Vector3[] = [];
	const spherical = new Spherical();

	while (points.length < count) {
		const randomPoint = new Vector3();
		randomPoint
			.set(randomFn(), randomFn(), randomFn())
			.multiplyScalar(2)
			.subScalar(1);

		spherical.setFromVector3(randomPoint);
		spherical.radius = randomBetween(radiusFrom, radiusTo, randomFn);
		randomPoint.setFromSpherical(spherical);

		points.push(randomPoint);
	}

	return points;
}
