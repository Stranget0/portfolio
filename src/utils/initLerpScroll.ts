import { clamp } from "three/src/math/MathUtils";
import NumberLerpable from "./NumberLerpable";
import initLerpPositions from "./lerpPositions";
import { onMiddleButtonScroll, onScrollbar } from "./eventHandlers";
import { getScrollPos } from "./getScrollPos";
import { getMaxPos } from "./getMaxPos";
import createCleanFunction from "./createCleanFunction";

export type Target = Window | HTMLElement;
export interface LerpControls {
	clean: () => void;
	scrollToElement: (scrollTarget: HTMLElement) => Promise<void>;
}

export default function initLerpScroll(
	target: Target,
	lerpAlpha: number,
	strength: number
): LerpControls {
	const xLerp = new NumberLerpable(getScrollPos(target, "x"));
	const yLerp = new NumberLerpable(getScrollPos(target, "y"));

	let lastTargetX = xLerp.value;
	let lastTargetY = yLerp.value;

	const cleanMenago = createCleanFunction();

	const { startLerp: startLerpY, cancel: cancelY } = initLerpPositions(() => {
		target.scrollTo({ top: yLerp.value });
	});
	const { startLerp: startLerpX, cancel: cancelX } = initLerpPositions(() => {
		target.scrollTo({ left: xLerp.value });
	});
	cleanMenago.push(cancel);

	let isScrollbarActive = false;
	const cleanScrollbarClick = onScrollbar((isActive) => {
		isScrollbarActive = isActive;
		if (isActive) cancel();
		else synchroniseValues();
	});
	cleanMenago.push(cleanScrollbarClick);

	let isMiddleButtonScrolling = false;
	const cleanMiddleButton = onMiddleButtonScroll((isScrolling) => {
		isMiddleButtonScrolling = isScrolling;
		if (isScrolling) cancel();
		else synchroniseValues();
	});
	cleanMenago.push(cleanMiddleButton);

	target.addEventListener("wheel", onWheel, { passive: false });
	cleanMenago.push(() => target.removeEventListener("wheel", onWheel));

	handleAnchorsScroll();

	return { clean: cleanMenago.clean, scrollToElement };

	function cancel() {
		cancelX();
		cancelY();
	}
	function synchroniseValues() {
		xLerp.value = lastTargetX = getScrollPos(target, "x");
		yLerp.value = lastTargetY = getScrollPos(target, "y");
	}

	function handleAnchorsScroll() {
		for (const anchor of document.querySelectorAll<HTMLAnchorElement>(
			'a[href^="#"]'
		)) {
			const handleAnchorScroll = (e: MouseEvent): void => {
				e.preventDefault();
				const clickTarget = e.target as HTMLElement | undefined;
				const anchor =
					clickTarget?.tagName === "a"
						? (clickTarget as HTMLAnchorElement)
						: clickTarget?.closest<HTMLAnchorElement>("a");
				if (!anchor?.href) return;
				const index = anchor.href.lastIndexOf("#");
				const selector = anchor.href.substring(index);
				const scrollTarget = document.querySelector<HTMLElement>(selector);
				if (!scrollTarget) return;

				scrollToElement(scrollTarget);
			};
			anchor.addEventListener("click", handleAnchorScroll);
			cleanMenago.push(() =>
				anchor.removeEventListener("click", handleAnchorScroll)
			);
		}
	}

	function scrollToElement(scrollTarget: HTMLElement) {
		const yPromise = new Promise<void>((resolve) => {
			lastTargetY = handleDirection(
				yLerp,
				scrollTarget.offsetTop,
				startLerpY,
				"y",
				undefined,
				resolve
			);
		});

		const xPromise = new Promise<void>((resolve) => {
			lastTargetX = handleDirection(
				xLerp,
				scrollTarget.offsetLeft,
				startLerpX,
				"x",
				undefined,
				resolve
			);
		});

		// Make promise type to void only
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		return Promise.all([xPromise, yPromise]).then(() => {});
	}

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
		const multiplier = isLineMode ? 16 : 1;

		e.preventDefault();

		// last target pos could be out of sync with current scroll position. If so use current scroll position instead
		const fromX = getFrom(xLerp, lastTargetX);
		const fromY = getFrom(yLerp, lastTargetY);

		const toX = clamp(
			fromX + e.deltaX * multiplier * strength,
			0,
			getMaxPos(target, "x")
		);
		const toY = clamp(
			fromY + e.deltaY * multiplier * strength,
			0,
			getMaxPos(target, "y")
		);

		lastTargetX = handleDirection(xLerp, toX, startLerpX, "x", 1);
		lastTargetY = handleDirection(yLerp, toY, startLerpY, "y", 1);
	}

	function handleDirection(
		lerpObject: NumberLerpable,
		to: number,
		startLerp: ReturnType<typeof initLerpPositions>["startLerp"],
		d: "x" | "y",
		EPS?: number,
		onFinish?: VoidFunction
	) {
		lerpObject.value = getScrollPos(target, d);
		startLerp(lerpObject, to, lerpAlpha, EPS, onFinish);

		return to;
	}
}

function getFrom(lerpObject: NumberLerpable, lastTarget: number) {
	const diff = Math.abs(lerpObject.value - lastTarget);
	return diff <= 1000 ? lastTarget : lerpObject.value;
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
