import { clamp } from "three/src/math/MathUtils";
import NumberLerpable from "./NumberLerpable";
import initLerpPositions from "./lerpPositions";

export default function initSmoothScroll(
	target: Window | HTMLElement,
	lerpAlpha: number,
	strength: number
) {
	const EPS = 1;

	const xLerp = new NumberLerpable(getScrollPos("x"));
	const yLerp = new NumberLerpable(getScrollPos("y"));
	const { startLerp: startLerpY } = initLerpPositions(() => {
		target.scrollTo({ top: yLerp.value });
	}, EPS);

	const { startLerp: startLerpX } = initLerpPositions(() => {
		target.scrollTo({ left: xLerp.value });
	}, EPS);

	const onWheel = (e: WheelEvent | Event): void => {
		if (!(e instanceof WheelEvent)) throw new Error("Invalid event type");
		e.preventDefault();
		yLerp.value = getScrollPos("y");
		xLerp.value = getScrollPos("x");

		const toY = clamp(
			yLerp.value + e.deltaY * strength,
			0,
			getMaxPos("Height")
		);
		const toX = clamp(xLerp.value + e.deltaX * strength, 0, getMaxPos("Width"));
		startLerpY(yLerp, toY, lerpAlpha);
		startLerpX(xLerp, toX, lerpAlpha);
	};

	target.addEventListener("wheel", onWheel, { passive: false });

	function getScrollPos(d: "x" | "y"): number {
		const map = {
			window: { x: "scrollX", y: "scrollY" },
			default: { x: "scrollTop", y: "scrollLeft" },
		} as const;

		if (target instanceof Window) {
			return target[map.window[d]];
		}
		return target[map.default[d]];
	}

	function getMaxPos(d: "Width" | "Height"): number {
		let container;
		if (target instanceof Window) container = document.documentElement;
		else container = target;
		return container[`scroll${d}`] - container[`client${d}`];
	}
}

// Less code and probably better performance, but slightly worse UX for now
// export default function initSmoothScroll(
// 	target: Window | HTMLElement,
// 	lerpAlpha: number,
// 	strength: number
// ) {
// 	const xLerp = new NumberLerpable(0);
// 	const yLerp = new NumberLerpable(0);
// 	const EPS = 0.4;
// 	const { startLerp: startLerpY } = initLerpPositions(() => {
// 		target.scrollBy({ top: yLerp.value });
// 	}, EPS);

// 	const { startLerp: startLerpX } = initLerpPositions(() => {
// 		target.scrollBy({ left: xLerp.value });
// 	}, EPS);

// 	const onWheel = (e: WheelEvent | Event): void => {
// 		if (!(e instanceof WheelEvent)) throw new Error("Invalid event type");
// 		e.preventDefault();
// 		const toY = e.deltaY * strength;
// 		const toX = e.deltaX * strength;
// 		yLerp.value = toY;
// 		xLerp.value = toX;
// 		startLerpY(yLerp, 0, lerpAlpha);
// 		startLerpX(xLerp, 0, lerpAlpha);
// 	};

// 	target.addEventListener("wheel", onWheel, { passive: false });
// }
