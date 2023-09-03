import type { Tooltip } from "./types";
import { tooltipAttr, tooltipIgnoreAttr, tooltipParentAttr } from "./constants";

export const tooltipOnHover = (t: Tooltip, requiredParent?: string) => ({
	[tooltipAttr]: t,
	[tooltipParentAttr]: requiredParent,
});

export const tooltipIgnore = { [tooltipIgnoreAttr]: "true" };
