import { clamp } from "three/src/math/MathUtils.js";
import NumberLerpable from "@utils/NumberLerpable";
import initLerpPositions from "@utils/lerpPositions";
import { onMiddleButtonScroll, onScrollbar } from "@utils/eventHandlers";
import { getScrollPos } from "@utils/getScrollPos";
import { getMaxPos } from "@utils/getMaxPos";
import createCleanFunction from "@utils/createCleanFunction";
import isomorphicScrollToElement from "./isomorphicScrollToElement";
import runOnEachPage from "@/utils/runOnEachPage";
import getFoxController from "@/components/ThreeScene/foxApi";

export type Target = Window | HTMLElement;

export type LerpScrollToElementOptions = Required<
	Pick<ScrollIntoViewOptions, "block" | "inline">
>;

export type LerpScrollToElement = (
	scrollTarget: HTMLElement,
	options: LerpScrollToElementOptions,
) => void;

export interface LerpControls {
	clean: () => void;
	lerpScrollToElement: LerpScrollToElement;
	synchronizeValues: VoidFunction;
}

export default function initLerpScroll(
	target: Target,
	lerpAlpha: number,
	strength: number,
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
		else synchronizeValues();
	});
	cleanMenago.push(cleanScrollbarClick);

	let isMiddleButtonScrolling = false;
	const cleanMiddleButton = onMiddleButtonScroll((isScrolling) => {
		isMiddleButtonScrolling = isScrolling;
		if (isScrolling) cancel();
		else synchronizeValues();
	});
	cleanMenago.push(cleanMiddleButton);

	target.addEventListener("wheel", onWheel, { passive: false });
	cleanMenago.push(() => target.removeEventListener("wheel", onWheel));

	runOnEachPage(() => {
		handleAnchorsScroll();
		synchronizeValues();
	});

	handleFocusFix();

	return { clean: cleanMenago.clean, lerpScrollToElement, synchronizeValues };

	function cancel() {
		cancelX();
		cancelY();
	}
	function synchronizeValues() {
		xLerp.value = lastTargetX = getScrollPos(target, "x");
		yLerp.value = lastTargetY = getScrollPos(target, "y");
		getFoxController()?.then((c) => {
			c.updateWaypointsPositions();
		});
	}

	function handleAnchorsScroll() {
		for (const anchor of document.querySelectorAll<HTMLAnchorElement>(
			'a[href^="#"]',
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

				isomorphicScrollToElement(lerpScrollToElement, scrollTarget, {
					behavior: "instant",
					onInstantScroll: synchronizeValues,
				});
			};
			anchor.addEventListener("click", handleAnchorScroll);
			cleanMenago.push(() =>
				anchor.removeEventListener("click", handleAnchorScroll),
			);
		}
	}

	function handleFocusFix() {
		document.addEventListener("focusin", () => {
			cancel();
			synchronizeValues();
		});
	}

	function lerpScrollToElement(
		scrollTarget: HTMLElement,
		options: LerpScrollToElementOptions,
	) {
		const { topOffset, leftOffset } = getOffsetsToElement(
			scrollTarget,
			options,
		);

		lastTargetY = handleDirection(yLerp, topOffset, startLerpY, "y", undefined);

		lastTargetX = handleDirection(
			xLerp,
			leftOffset,
			startLerpX,
			"x",
			undefined,
		);
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
			getMaxPos(target, "x"),
		);
		const toY = clamp(
			fromY + e.deltaY * multiplier * strength,
			0,
			getMaxPos(target, "y"),
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
		onFinish?: VoidFunction,
	) {
		lerpObject.value = getScrollPos(target, d);
		startLerp(lerpObject, to, lerpAlpha, EPS, onFinish);

		return to;
	}
}

function partSize(size: number, offset: ScrollLogicalPosition) {
	const defaultMargin = 32;
	switch (offset) {
		case "start":
			return defaultMargin;
		case "center":
			return -window.innerHeight / 2 + size / 2;
		case "end":
			return -window.innerHeight + size - defaultMargin;
		default:
			console.warn(offset, "not supported");
			return -window.innerHeight / 2 + size / 2;
	}
}

function getOffsetsToElement(
	scrollTarget: HTMLElement,
	{ block, inline }: Required<Pick<ScrollIntoViewOptions, "block" | "inline">>,
) {
	const rect = scrollTarget.getBoundingClientRect();
	const topOffset = window.scrollY + rect.top + partSize(rect.height, block);
	const leftOffset = window.scrollY + rect.left + partSize(rect.width, inline);

	return { topOffset, leftOffset };
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
