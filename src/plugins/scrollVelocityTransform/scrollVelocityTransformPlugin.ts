import { scroll } from "motion";
import {
	velocityTransformAttr,
	velocityTransformReversedAttr,
} from "./constants";

const elementsToTransform = document.querySelectorAll<HTMLElement>(
	`[${velocityTransformAttr}]`
);
const elementsToTransformReversed = document.querySelectorAll<HTMLElement>(
	`[${velocityTransformReversedAttr}]`
);

scroll(({ y }) => {
	const pageVelocity = Math.min(Math.abs(y.velocity / window.innerHeight), 1);
	const deltaX = -pageVelocity / 6;
	const deltaY = pageVelocity / 18;

	const transform = `scale3d(${1 + deltaX}, ${1 + deltaY}, 1)`;
	const transformReversed = `scale3d(${1 - deltaX}, ${1 - deltaY}, 1)`;

	for (const element of elementsToTransform) {
		element.style.transform = transform;
	}
	for (const element of elementsToTransformReversed) {
		element.style.transform = transformReversed;
	}
});
