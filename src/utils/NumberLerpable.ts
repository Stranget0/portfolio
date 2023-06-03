import { lerp } from "three/src/math/MathUtils";
import type { LerpObject } from "./lerpPositions";

export default class NumberLerpable implements LerpObject<number>{
	value: number;
	constructor(value: number){
		this.value = value;
	}
	distanceTo(target: number): number {
			return Math.abs(target - this.value);
	}
	lerp(target: number, alpha: number): number {
		this.value =	lerp(this.value, target, alpha)
		return this.value;
	}
}