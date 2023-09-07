import runOnEachPage from "@/utils/runOnEachPage";
import importInView from "@utils/importInView/importInView";

runOnEachPage(() => {
	importInView(
		"[data-static-h], [data-static-w]",
		() => import("@plugins/staticViewportUnits/staticViewportUnits"),
	);
});
