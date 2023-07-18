import type ThreeController from "@utils/ThreeController";
import { inView } from "motion";

export default function stopLoopOnObstacles(
	controller: ThreeController,
	selector: string
) {
	for (const obstacle of document.querySelectorAll<HTMLElement>(selector)) {
		const ratio = window.innerHeight / obstacle.clientHeight / 1.1;
		inView(
			obstacle,
			() => {
				controller.stopLoop();
				return () => controller.startLoop();
			},
			{ amount: Math.min(ratio, 1) }
		);
	}
}
