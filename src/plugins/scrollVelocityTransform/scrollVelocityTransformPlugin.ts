import { motionSafeMedia } from "@/constants";
import {
	scrollVelocityTransformAttr,
	scrollVelocityTransformDataKey,
} from "./constants";
import { clamp } from "three/src/math/MathUtils.js";
import { inView, scroll } from "motion";
import initLerpPositions from "@/utils/lerpPositions";
import NumberLerpable from "@/utils/NumberLerpable";

if (motionSafeMedia.matches) {
	const elements: HTMLElement[] = [];
	const from = new NumberLerpable(0);
	const to = new NumberLerpable(0);

	const { startLerp, isRunning } = initLerpPositions(() => {
		const pageVelocity = clamp(from.value, -1, 1);

		elements.forEach((e) => {
			const ratio = parseFloat(
				e.dataset[scrollVelocityTransformDataKey] || "5"
			);
			const transform = `translate3d(0,${1 - pageVelocity * ratio}px,0)`;
			e.style.transform = transform;
		});
	}, 0.00001);

	inView(`[${scrollVelocityTransformAttr}]`, ({ target }) => {
		elements.push(target as HTMLElement);
		return () => {
			const elementIndex = elements.indexOf(target as HTMLElement);
			if (elementIndex === -1) return;
			resetElements([elements[elementIndex]]);
			elements.splice(elementIndex, 1);
		};
	});

	scroll(({ y }) => {
		to.value = y.velocity / window.innerHeight;

		if (!isRunning())
			startLerp(from, to, 0.1, undefined, () => resetElements(elements));
	});
}

function resetElements(elements: HTMLElement[]) {
	elements.forEach((t) => {
		t.style.transform = "";
	});
}
