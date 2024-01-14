import ThreeController, { type ThreeModule } from "@utils/ThreeController";
import { threeCanvasId } from "../constants";

import { ACESFilmicToneMapping, PerspectiveCamera, VSMShadowMap } from "three";
import { breakpoints } from "@/medias";

export default function initHeroController<Ms extends ThreeModule[]>(
	...modules: Ms
) {
	const camera = new PerspectiveCamera(
		70,
		window.innerWidth / window.innerHeight,
	);

	camera.position.set(-1, 1, 3);

	const heroController = ThreeController.createWithModules(
		`#${threeCanvasId}`,
		camera,
		{ modules, renderer: { antialias: breakpoints[1024].matches } },
	);

	heroController.renderer.toneMapping = ACESFilmicToneMapping;
	heroController.renderer.toneMappingExposure = 5;
	heroController.renderer.shadowMap.type = VSMShadowMap;

	let { innerWidth: lastWidth, innerHeight: lastHeight } = window;

	window.addEventListener("resize", () => {
		const diffH = Math.abs(window.innerHeight - lastHeight);

		const isResizeDueMobileBar =
			!breakpoints[756].matches &&
			diffH < 300 &&
			lastWidth === window.innerWidth;

		if (isResizeDueMobileBar) return;

		lastWidth = window.innerWidth;
		lastHeight = window.innerHeight;
		heroController.setSize(lastWidth, lastHeight);
	});
	return heroController;
}
