import type { LerpControls } from "@plugins/lerpScroll/initLerpScroll";
import isomorphicScrollToElement from "./isomorphicScrollToElement";
import { motionSafeMedia, pointerMedia } from "@/medias";

let lerpScroll: null | Promise<LerpControls> = null;

if (pointerMedia.matches && motionSafeMedia.matches) {
	lerpScroll = import("@plugins/lerpScroll/initLerpScroll").then(
		({ default: initLerpScroll }) => {
			const controls = initLerpScroll(window, 0.075, 0.75);


			return controls;
		},
	);
}

export async function scrollToElement(
	element: HTMLElement,
	options?: ScrollIntoViewOptions,
) {
	const { lerpScrollToElement } = (await lerpScroll) || {};
	isomorphicScrollToElement(lerpScrollToElement, element, options);
}
