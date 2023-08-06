import { lerp } from "three/src/math/MathUtils.js";
import type { LerpObject } from "./lerpPositions";

export default class NumberLerpable implements LerpObject<number> {
	value: number;
	constructor(value: number) {
		this.value = value;
	}
	distanceTo(target: number | LerpObject<number>): number {
		const value =
			target instanceof NumberLerpable ? target.value : (target as number);
		return Math.abs(value - this.value);
	}
	lerp(target: number | NumberLerpable, alpha: number): number {
		this.value = lerp(
			this.value,
			typeof target === "number" ? target : target.value,
			alpha
		);
		return this.value;
	}
	clone(): LerpObject<number> {
		return new NumberLerpable(this.value);
	}
}
