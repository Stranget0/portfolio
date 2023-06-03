import { Spherical, Vector3 } from "three";
import type { LerpObject } from "./lerpPositions";
import { lerp } from "three/src/math/MathUtils";

export default class SphericalLerpable
	extends Spherical
	implements LerpObject<Spherical>
{
	distanceTo(target: Spherical | Vector3): number {
		const thisPosition = new Vector3().setFromSpherical(this);
		const targetPosition =
			target instanceof Vector3
				? target
				: new Vector3().setFromSpherical(target);

		return thisPosition.distanceTo(targetPosition);
	}
	lerp(target: Spherical, alpha: number): SphericalLerpable {
		this.theta = lerp(this.theta, target.theta, alpha);
		this.phi = lerp(this.phi, target.phi, alpha);
		this.radius = lerp(this.radius, target.radius, alpha);
		return this;
	}
}
