import type { LerpControls } from "@utils/initLerpScroll";

const pointerMedia = matchMedia("(pointer:fine)");

let lerpScroll: null | Promise<LerpControls> = null;

if (pointerMedia.matches) {
	lerpScroll = import("@utils/initLerpScroll").then(
		({ default: initLerpScroll }) => {
			return initLerpScroll(window, 0.075, 0.75);
		}
	);
}

export async function scrollToElement(element: HTMLElement) {
	if (lerpScroll) {
		const { scrollToElement } = await lerpScroll;
		return scrollToElement(element);
	} else element.scrollIntoView({ behavior: "smooth" });
}
