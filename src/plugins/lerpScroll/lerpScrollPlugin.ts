import type { LerpControls } from "@plugins/lerpScroll/initLerpScroll";
import { motionSafeMedia, pointerMedia } from "src/constants";
import isomorphicScrollToElement from "./isomorphicScrollToElement";

let lerpScroll: null | Promise<LerpControls> = null;

if (pointerMedia.matches && motionSafeMedia.matches) {
	lerpScroll = import("@plugins/lerpScroll/initLerpScroll").then(
		({ default: initLerpScroll }) => {
			return initLerpScroll(window, 0.075, 0.75);
		}
	);
}

export async function scrollToElement(
	element: HTMLElement,
	options?: ScrollIntoViewOptions
) {
	const { lerpScrollToElement } = (await lerpScroll) || {};
	isomorphicScrollToElement(lerpScrollToElement, element, options);
}
