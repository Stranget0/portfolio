import { classInViewAttr, classInViewContainerAttr } from "./constants";

export const classInView = (className: string) => ({
	[classInViewAttr]: className,
});

export const classInViewParent = { [classInViewContainerAttr]: true };
