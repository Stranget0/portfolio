import type ThreeController from "@utils/ThreeController";

import { Fog } from "three";

export default function fog(controller: ThreeController) {
	const fog = new Fog(0xffffff, 2.5, 5);
	controller.scene.fog = fog;
	controller.render();
}
