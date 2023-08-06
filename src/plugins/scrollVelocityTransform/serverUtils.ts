import { scrollVelocityTransformAttr } from "./constants";

export function scrollVelocityTransform(ratio: number) {
	return { [scrollVelocityTransformAttr]: ratio };
}
