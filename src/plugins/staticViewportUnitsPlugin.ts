import importInView from "@utils/importInView/importInView";

importInView(
	"[data-static-h], [data-static-w]",
	() => import("@utils/staticViewportUnits")
);
