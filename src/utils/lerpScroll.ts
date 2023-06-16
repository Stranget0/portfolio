import { clamp } from "three/src/math/MathUtils";
import NumberLerpable from "./NumberLerpable";
import initLerpPositions from "./lerpPositions";
import { onMiddleButtonScroll, onScrollbar } from "./eventHandlers";
import { getScrollPos } from "./getScrollPos";
import { getMaxPos } from "./getMaxPos";
import createCleanFunction from "./createCleanFunction";

export type Target = Window | HTMLElement;

export default function initSmoothScroll(
	target: Target,
	lerpAlpha: number,
	strength: number
) {
	const EPS = 1;

	const xLerp = new NumberLerpable(getScrollPos(target, "x"));
	const yLerp = new NumberLerpable(getScrollPos(target, "y"));

	let lastTargetX = xLerp.value;
	let lastTargetY = yLerp.value;

	const cleanMenago = createCleanFunction();

	const { startLerp: startLerpY, cancel: cancelY } = initLerpPositions(() => {
		target.scrollTo({ top: yLerp.value });
	}, EPS);
	cleanMenago.push(cancelY);

	const { startLerp: startLerpX, cancel: cancelX } = initLerpPositions(() => {
		target.scrollTo({ left: xLerp.value });
	}, EPS);
	cleanMenago.push(cancelX);

	let isScrollbarActive = false;
	const cleanScrollbarClick = onScrollbar((isActive) => {
		isScrollbarActive = isActive;
		if (isActive) {
			cancelX();
			cancelY();
		}
	});
	cleanMenago.push(cleanScrollbarClick);

	let isMiddleButtonScrolling = false;
	const cleanMiddleButton = onMiddleButtonScroll((isScrolling) => {
		isMiddleButtonScrolling = isScrolling;
		if (isScrolling) {
			cancelX();
			cancelY();
		}
	});
	cleanMenago.push(cleanMiddleButton);

	target.addEventListener("wheel", onWheel, { passive: false });
	cleanMenago.push(() => target.removeEventListener("wheel", onWheel));

	return cleanMenago.clean;

	function onWheel(e: WheelEvent | Event): void {
		if (!(e instanceof WheelEvent)) throw new Error("Invalid event type");
		if (
			e.ctrlKey ||
			e.defaultPrevented ||
			isScrollbarActive ||
			isMiddleButtonScrolling
		)
			return;

		const isLineMode = e.deltaMode === 1;
		const multiplier = isLineMode ? 40 : 1;

		e.preventDefault();

		lastTargetX = handleDirection(
			xLerp,
			lastTargetX,
			e.deltaX * multiplier,
			startLerpX,
			"x"
		);
		lastTargetY = handleDirection(
			yLerp,
			lastTargetY,
			e.deltaY * multiplier,
			startLerpY,
			"y"
		);

		function handleDirection(
			lerpObject: NumberLerpable,
			lastTarget: number,
			delta: number,
			startLerp: ReturnType<typeof initLerpPositions>["startLerp"],
			d: "x" | "y"
		) {
			lerpObject.value = getScrollPos(target, d);

			// last target pos could be out of sync with current scroll position. If so use current scroll position instead
			const from =
				Math.abs(lerpObject.value - lastTarget) <= 1000
					? lastTarget
					: lerpObject.value;

			const to = clamp(from + delta * strength, 0, getMaxPos(target, d));
			startLerp(lerpObject, to, lerpAlpha);

			return to;
		}
	}
}

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
