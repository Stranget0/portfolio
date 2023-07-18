import type ThreeController from "@utils/ThreeController";

export default function renderObstacles(controller: ThreeController) {
	return {
		setObstacleSelector(selector: string) {
			import("./stopLoopOnObstacles").then(({ default: stopLoopOnObstacles }) =>
				stopLoopOnObstacles(controller, selector)
			);
		},
	};
}
