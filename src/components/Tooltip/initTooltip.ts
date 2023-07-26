import { inView } from "motion";
import { pointerMedia } from "src/constants";
import { tooltipAttr, tooltipDataKey, tooltipParentDataKey } from "./constants";
import type { Tooltip } from "./types";

type Handler = (target: HTMLElement) => void;

export default function attachTooltipListeners(
	handlers?: Partial<{ [k in Tooltip]: Handler }>
) {
	if (!pointerMedia.matches) return;
	inView(`[${tooltipAttr}]`, (a) => {
		import("./utils").then(({ tooltipSignal }) => {
			const target = a.target as HTMLElement;
			const setTooltip = tooltipSignal[1];
			const tooltipOption = target.dataset[tooltipDataKey] as Tooltip;
			const tooltipParentS = target.dataset[tooltipParentDataKey];

			const isIgnored = tooltipParentS && !target.closest(tooltipParentS);
			if (isIgnored) return;

			target.addEventListener("mouseenter", () => {
				target.classList.add("cursor-none");
				setTooltip(tooltipOption);
			});

			const disable = () => {
				target.classList.remove("cursor-none");
				setTooltip();
			};
			const onPrimary = () => {
				disable();
				handlers?.[tooltipOption]?.(target);
			};
			target.addEventListener("mouseleave", disable);
			target.addEventListener("mousedown", onPrimary);
		});
	});
}
