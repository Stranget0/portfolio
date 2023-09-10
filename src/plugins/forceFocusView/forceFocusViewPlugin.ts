import { scrollToElement } from "@plugins/lerpScroll/lerpScrollPlugin";
import { forceFocusViewAttr } from "./constants";
import runOnEachPage from "@/utils/runOnEachPage";

runOnEachPage(() => {
	for (const container of document.querySelectorAll<HTMLElement>(
		`[${forceFocusViewAttr}]`,
	)) {
		const navigables = container.querySelectorAll<HTMLElement>(
			"a, button, input, textarea, select",
		);

		for (const navigable of navigables) {
			let isIgnored = false;

			const ignore = () => {
				isIgnored = true;
			};
			const handleScrollTo = () => {
				if (!isIgnored) scrollToElement(container, { behavior: "instant" });
				isIgnored = false;
			};

			navigable.addEventListener("mousedown", ignore);
			navigable.addEventListener("touchstart", ignore, { passive: true });
			navigable.addEventListener("focus", handleScrollTo);
		}
	}
});
