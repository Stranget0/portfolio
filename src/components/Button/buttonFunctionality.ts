import createCleanFunction from "@/utils/createCleanFunction";
import type { CloseType } from "./types";

for (const target of document.querySelectorAll<HTMLElement>(
	"[data-target-selector]"
)) {
	const rawClass = target.dataset["targetClassToggle"] || "";
	const targetSelector = target.dataset["targetSelector"];
	const pointedElement =
		targetSelector && document.querySelector<HTMLElement>(targetSelector);
	const cleanMenago = createCleanFunction();
	if (!pointedElement || !targetSelector) {
		if (!pointedElement) {
			console.error(
				"No pointer element found",
				target,
				"with selector",
				targetSelector
			);
		}

		continue;
	}

	const classes = rawClass.split(" ");
	const rawCloseType = target.dataset["closeType"] as CloseType | undefined;
	const closeType: CloseType = rawCloseType || "non-interactive-click";

	const toggle = () =>
		classes.forEach((className) => pointedElement.classList.toggle(className));

	target.addEventListener("click", () => {
		cleanMenago.clean();
		toggle();

		if (closeType === "non-interactive-click")
			cleanMenago.push(closeOnNonInteractive(pointedElement, toggle));
		else if (closeType === "any-click")
			cleanMenago.push(closeOnClick(pointedElement, toggle));
	});
}

function closeOnClick(element: HTMLElement, onClick: VoidFunction) {
	element.addEventListener("click", onClick);
	return () => element.removeEventListener("click", onClick);
}

function closeOnNonInteractive(element: HTMLElement, onClose: VoidFunction) {
	function handler(e: MouseEvent): void {
		const isTargetInteractive =
			!e.target ||
			["button", "a"].includes((e.target as HTMLElement).tagName.toLowerCase());

		if (!isTargetInteractive) {
			onClose();
		}
	}
	const timeoutId = window.setTimeout(() => {
		element.addEventListener("click", handler);
	});

	return () => {
		clearTimeout(timeoutId);
		element.removeEventListener("click", handler);
	};
}
