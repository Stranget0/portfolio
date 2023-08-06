import {
	classInViewAttr,
	classInViewWorkaroundAttr,
	classInViewThresholdAttr,
} from "./constants";

export const classInView = (
	classOut: string,
	classIn: string,
	threshold?: number,
	useWorkaround?: boolean
) => ({
	[classInViewAttr]: `${classOut || " "};${classIn || " "}`,
	[classInViewThresholdAttr]:
		typeof threshold === "number" ? threshold : undefined,
	[classInViewWorkaroundAttr]: useWorkaround ? true : undefined,
});
