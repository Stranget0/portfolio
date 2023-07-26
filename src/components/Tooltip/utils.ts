import { createSignal } from "solid-js";
import type { Tooltip } from "./types";
import { tooltipAttr, tooltipParentAttr } from "./constants";

export const tooltipSignal = createSignal<string>();

export const tooltipOnHover = (t: Tooltip, requiredParent?: string) => ({
	[tooltipAttr]: t,
	[tooltipParentAttr]: requiredParent,
});
