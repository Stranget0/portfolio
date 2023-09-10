import runOnEachPage from "@/utils/runOnEachPage";
import {
	foxClassOnLoadedAttr,
	foxClassOnLoadedDataKey,
	foxClassOnLoadingAttr,
	foxClassOnLoadingDataKey,
} from "./constants";
import { setBottomStatus } from "../BottomStatus/state";

export function handleLoadingStatus() {
	foxHandleOnClasses(foxClassOnLoadingAttr, foxClassOnLoadingDataKey);
	setBottomStatus("spinner")
}

export function handleLoadedStatus() {
	foxHandleOnClasses(foxClassOnLoadingAttr, foxClassOnLoadingDataKey, "remove");
	runOnEachPage(() => {
		foxHandleOnClasses(foxClassOnLoadedAttr, foxClassOnLoadedDataKey);
	});
	setBottomStatus(null)
}

function foxHandleOnClasses(
	attr: string,
	key: string,
	mode: "add" | "remove" = "add",
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
		if (mode === "add" && className.includes("hidden")) {
			element.remove();
		}

		element.classList[mode](...className.split(" "));
	}
}
