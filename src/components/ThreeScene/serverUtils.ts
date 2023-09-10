import { foxClassOnLoadedAttr, foxClassOnLoadingAttr } from "./constants";

export function classOnFoxLoaded(className: string) {
	return { [foxClassOnLoadedAttr]: className };
}
export function classOnFoxLoading(className: string) {
	return { [foxClassOnLoadingAttr]: className };
}


