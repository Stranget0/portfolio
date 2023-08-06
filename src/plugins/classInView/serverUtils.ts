import { classInViewAttr, classInViewThresholdAttr } from "./constants";

export const classInView = (
	classOut: string,
	classIn: string,
	threshold?: number
) => ({
	[classInViewAttr]: `${classOut || " "};${classIn || " "}`,
	[classInViewThresholdAttr]:
		typeof threshold === "number" ? threshold : undefined,
});
