import ThreeController, { ThreeModule } from "@utils/ThreeController";
import { threeCanvasId } from "./constants";

import { ACESFilmicToneMapping, PerspectiveCamera, VSMShadowMap } from "three";

export default function initHeroController<Ms extends ThreeModule[]>(
	...modules: Ms
) {
	const camera = new PerspectiveCamera(
		70,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.set(-1, 1, 3);

	const heroController = ThreeController.createWithModules(
		`#${threeCanvasId}`,
		window.innerWidth,
		window.innerHeight,
		camera,
		...modules
	);

	heroController.renderer.toneMapping = ACESFilmicToneMapping;
	heroController.renderer.toneMappingExposure = 2;
	heroController.renderer.shadowMap.type = VSMShadowMap;

	return heroController;
}
