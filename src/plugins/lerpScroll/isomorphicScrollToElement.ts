import { motionSafeMedia } from "@/medias";
import type { LerpScrollToElement } from "@plugins/lerpScroll/initLerpScroll";

interface ScrollOptions extends ScrollIntoViewOptions {
	onInstantScroll?: VoidFunction;
}

export default function isomorphicScrollToElement(
	lerpScrollToElement: LerpScrollToElement | undefined,
	element: HTMLElement,
	{
		behavior = motionSafeMedia.matches ? "smooth" : "instant",
		block = element.clientHeight >= window.innerHeight ? "start" : "center",
		inline = element.clientWidth >= window.innerWidth ? "start" : "center",
		onInstantScroll,
	}: ScrollOptions = {},
) {
	if (lerpScrollToElement && behavior === "smooth") {
		lerpScrollToElement(element, {
			block,
			inline,
		});
	} else {
		element.scrollIntoView({
			behavior,
			block,
			inline,
		});
		onInstantScroll?.();
	}
}
