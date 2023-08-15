import { foxClassOnLoadedAttr, foxClassOnLoadingAttr } from "./constants";

export function classOnFoxLoaded(className: string) {
	return { [foxClassOnLoadedAttr]: className };
}
export function classOnFoxLoading(className: string) {
	return { [foxClassOnLoadingAttr]: className };
}

export function foxHandleOnClasses(
	attr: string,
	key: string,
	mode: "add" | "remove" = "add"
) {
	for (const element of document.querySelectorAll<HTMLElement>(`[${attr}]`)) {
		const className = element.dataset[key] || "";
		if (!className) continue;

		const isToHide = /opacity-0|scale-0/.test(className);
		const isToAppear = /opacity-100|scale-100/.test(className);

		if (mode === "add" ? isToHide : isToAppear) element.ariaHidden = "true";
		if (mode === "add" ? isToAppear : isToHide) {
			if (!element.ariaHidden)
				console.warn("No required hidden status", element);

			element.ariaHidden = null;
		}

		element.classList[mode](...className.split(" "));
	}
}
