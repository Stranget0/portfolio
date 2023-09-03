import { foxClassOnLoadingAttr, foxClassOnLoadingDataKey } from "./constants";
import type { FoxControllerType } from "./foxController";
import { foxHandleOnClasses } from "./serverUtils";

let foxPromise: null | Promise<FoxControllerType> = null;

document.addEventListener("scroll", load, { once: true });

function load() {
	foxHandleOnClasses(foxClassOnLoadingAttr, foxClassOnLoadingDataKey);
	foxPromise = import("./foxController").then(({ default: d }) => d);
}

export default function getFoxController() {
	return foxPromise;
}
