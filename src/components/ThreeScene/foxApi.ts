import { foxClassOnLoadingAttr, foxClassOnLoadingDataKey } from "./constants";
import type { FoxControllerType } from "./foxController";
import { foxHandleOnClasses } from "./serverUtils";

let foxPromise: null | Promise<FoxControllerType> = null;

document.addEventListener("scroll", onScroll);

function onScroll() {
	if (window.scrollY > 0) {
		document.removeEventListener("scroll", onScroll);
		load();
	}
}
function load() {
	foxHandleOnClasses(foxClassOnLoadingAttr, foxClassOnLoadingDataKey);
	foxPromise = import("./foxController").then(({ default: d }) => d);
}

export default function getFoxController() {
	return foxPromise;
}
