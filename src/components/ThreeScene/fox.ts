import type { FoxControllerType } from "./foxController";

const foxController = new Promise<FoxControllerType>((resolve) => {
	requestIdleCallback(() => {
		resolve(
			import("./foxController").then(({ default: controller }) => controller)
		);
	});
});

export default foxController;
