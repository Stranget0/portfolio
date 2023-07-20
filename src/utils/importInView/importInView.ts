import type { ElementOrSelector } from "motion";

export default function importInView<T>(
	elementOrSelector: ElementOrSelector,
	importStatement: () => Promise<T>
) {
	return new Promise((resolve) => {
		requestIdleCallback(() => {
			import("./inViewOnlyExport").then(({ default: inView }) => {
				inView(
					elementOrSelector,
					() => {
						importStatement().then(resolve).catch(console.error);
					},
					{ margin: "500px 500px 500px 500px" }
				);
			});
		});
	});
}
