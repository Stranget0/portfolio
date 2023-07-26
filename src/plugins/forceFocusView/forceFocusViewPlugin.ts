import { scrollToElement } from "@plugins/lerpScroll/lerpScrollPlugin";
import { forceFocusViewAttr } from "./constants";

for (const container of document.querySelectorAll<HTMLElement>(
	`[${forceFocusViewAttr}]`
)) {
	const navigables = container.querySelectorAll<HTMLElement>(
		"a, button, input, textarea, select"
	);

	for (const navigable of navigables) {
		navigable.addEventListener("focus", () =>
			scrollToElement(container, false)
		);
	}
}
