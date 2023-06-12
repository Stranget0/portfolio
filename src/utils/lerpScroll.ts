import { clamp } from "three/src/math/MathUtils";
import NumberLerpable from "./NumberLerpable";
import initLerpPositions from "./lerpPositions";
import { onMiddleButtonScroll, onScrollbar } from "./eventHandlers";

export default function initSmoothScroll(
	target: Window | HTMLElement,
	lerpAlpha: number,
	strength: number
) {
	const EPS = 1;

	const xLerp = new NumberLerpable(getScrollPos("x"));
	const yLerp = new NumberLerpable(getScrollPos("y"));

	let lastTargetX = xLerp.value;
	let lastTargetY = yLerp.value;

	const cleanArr: VoidFunction[] = [];

	const { startLerp: startLerpY, cancel: cancelY } = initLerpPositions(() => {
		target.scrollTo({ top: yLerp.value });
	}, EPS);
	cleanArr.push(cancelY);

	const { startLerp: startLerpX, cancel: cancelX } = initLerpPositions(() => {
		target.scrollTo({ left: xLerp.value });
	}, EPS);
	cleanArr.push(cancelX);

	let isScrollbarActive = false;
	const cleanScrollbarClick = onScrollbar((isActive) => {
		isScrollbarActive = isActive;
		if (isActive) {
			cancelX();
			cancelY();
		}
	});
	cleanArr.push(cleanScrollbarClick);

	let isMiddleButtonScrolling = false;
	const cleanMiddleButton = onMiddleButtonScroll((isScrolling) => {
		isMiddleButtonScrolling = isScrolling;
		if (isScrolling) {
			cancelX();
			cancelY();
		}
	});
	cleanArr.push(cleanMiddleButton);

	target.addEventListener("wheel", onWheel, { passive: false });
	cleanArr.push(() => target.removeEventListener("wheel", onWheel));

	return clean;

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
			lerpObject.value = getScrollPos(d);

			// last target pos could be out of sync with current scroll position. If so use current scroll position instead
			const from =
				Math.abs(lerpObject.value - lastTarget) <= 1000
					? lastTarget
					: lerpObject.value;

			const to = clamp(from + delta * strength, 0, getMaxPos(d));
			startLerp(lerpObject, to, lerpAlpha);

			return to;
		}
	}
	function clean() {
		while (cleanArr.length) {
			cleanArr.pop()?.();
		}
	}

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

	function getMaxPos(direction: "x" | "y"): number {
		const d = direction === "x" ? "Width" : "Height";
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
