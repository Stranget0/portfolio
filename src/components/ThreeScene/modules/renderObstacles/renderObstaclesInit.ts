import type ThreeController from "@utils/ThreeController";
import stopLoopOnObstacles from "./stopLoopOnObstacles";

export default function renderObstacles(controller: ThreeController) {
	return {
		setObstacleSelector(selector: string) {
			stopLoopOnObstacles(controller, selector);
		},
	};
}
