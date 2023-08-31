import { motionSafeMedia } from "@/constants";
import type { LerpScrollToElement } from "@plugins/lerpScroll/initLerpScroll";

export default function isomorphicScrollToElement(
	lerpScrollToElement: LerpScrollToElement | undefined,
	element: HTMLElement,
	{
		behavior = motionSafeMedia.matches ? "smooth" : "instant",
		block = element.clientHeight >= window.innerHeight ? "start" : "center",
		inline = element.clientWidth >= window.innerWidth ? "start" : "center",
	}: ScrollIntoViewOptions = {}
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
	}
}
