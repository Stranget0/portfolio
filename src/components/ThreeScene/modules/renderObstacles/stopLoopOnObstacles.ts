import type ThreeController from "@utils/ThreeController";
import { inView } from "motion";
import getFullRatioForIntersection from "../../../../utils/getFullRatioForIntersection";

export default function stopLoopOnObstacles(
	controller: ThreeController,
	selector: string
) {
	for (const obstacle of document.querySelectorAll<HTMLElement>(selector)) {
		const ratio = getFullRatioForIntersection(obstacle);
		inView(
			obstacle,
			() => {
				controller.stopLoop();
				return () => controller.startLoop();
			},
			{ amount: ratio }
		);
	}
}
