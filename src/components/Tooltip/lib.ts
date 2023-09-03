import { pointerMedia } from "src/constants";
import {
	tooltipAttr,
	tooltipDataKey,
	tooltipIgnoreAttr,
	tooltipParentDataKey,
} from "./constants";
import type { Tooltip } from "./types";
import { tooltipSignal } from "./utils";

type Handler = (target: HTMLElement) => void;
type Checker = () => boolean;

type Handlers = Partial<{
	[k in Tooltip]: Handler;
}>;

type Checkers = Partial<{
	[k in Tooltip]: Checker;
}>;

export default function attachTooltipListeners(
	handlers?: Handlers,
	checkers?: Checkers
) {
	if (!pointerMedia.matches) return;
	const [tooltip, setTooltip] = tooltipSignal;
	const ignoredElements = document.querySelectorAll<HTMLElement>(
		`[${tooltipIgnoreAttr}]`
	);

	let ignoredNum = 0;

	for (const target of document.querySelectorAll<HTMLElement>(
		`[${tooltipAttr}]`
	)) {
		const tooltipOption = target.dataset[tooltipDataKey] as Tooltip;
		const checker = checkers?.[tooltipOption];
		const tooltipParentSelector = target.dataset[tooltipParentDataKey];
		const hasRequiredParentIfAny =
			tooltipParentSelector && !target.closest(tooltipParentSelector);

		const { enable, disable, onPrimary } = getActions(
			checker,
			target,
			tooltipOption,
			handlers
		);

		if (hasRequiredParentIfAny) return;
		target.addEventListener("mouseenter", enable);
		target.addEventListener("mouseleave", disable);
		target.addEventListener("mousedown", onPrimary);
		target.addEventListener("mousemove", () => {
			if (!ignoredNum && !tooltip()) {
				enable();
			}
		});
	}

	for (const ignoredElement of ignoredElements) {
		const { disable } = getActions();
		ignoredElement.addEventListener("mouseenter", () => {
			disable();
			ignoredNum++;
		});
		ignoredElement.addEventListener("mouseleave", () => {
			ignoredNum--;
		});
	}

	function getActions(
		checker?: Checker,
		target?: HTMLElement,
		tooltipOption?: Tooltip,
		handlers?: Handlers
	) {
		function checkChecker() {
			return checker && !checker();
		}
		function disable() {
			if (checkChecker()) return;
			target?.classList.remove("cursor-none");
			setTooltip();
		}

		return {
			disable,

			onPrimary(e: MouseEvent) {
				if (e.button !== 0 || checkChecker() || ignoredNum) return;
				disable();
				if (tooltipOption && target && handlers)
					handlers[tooltipOption]?.(target);
			},

			enable() {
				if (checkChecker()) return;
				target?.classList.add("cursor-none");
				setTooltip(tooltipOption);
			},
		};
	}
}
