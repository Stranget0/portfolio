import ThreeController, { ThreeModule } from "@utils/ThreeController";
import { threeCanvasId } from "./constants";

import { ACESFilmicToneMapping, PerspectiveCamera, VSMShadowMap } from "three";
import { breakpoints } from "@/constants";

export default function initHeroController<Ms extends ThreeModule[]>(
	...modules: Ms
) {
	const camera = new PerspectiveCamera(
		70,
		window.innerWidth / window.innerHeight
	);

	camera.position.set(-1, 1, 3);

	const isBigScreen = breakpoints[1024].matches;
	const heroController = ThreeController.createWithModules(
		`#${threeCanvasId}`,
		camera,
		{ modules }
	);

	heroController.renderer.toneMapping = ACESFilmicToneMapping;
	heroController.renderer.toneMappingExposure = 2;
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
