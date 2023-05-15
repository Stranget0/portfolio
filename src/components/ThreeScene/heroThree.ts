import ThreeController from "@utils/ThreeController";
import { threeCanvasId } from "./constants";
import onResizeScreen from "@utils/resizer";

import {
	ACESFilmicToneMapping,
	AxesHelper,
	DirectionalLight,
	DirectionalLightHelper,
	HemisphereLight,
	HemisphereLightHelper,
} from "three";
import { addLocationControls } from "@utils/gui";

export default function initHeroController() {
	const heroThree = new ThreeController(
		`#${threeCanvasId}`,
		window.innerWidth,
		window.innerHeight
	);

	const removeOnResize = onResizeScreen(({ width, height }) => {
		heroThree.setSize(width, height);
	});

	heroThree.renderer.toneMapping = ACESFilmicToneMapping;
	heroThree.renderer.autoClear = false;
	// heroThree.renderer.clearColor = 0xffffff;

	heroThree.onDestroy(removeOnResize);

	heroThree.camera.position.set(-1, 1, 3);
	heroThree.camera.rotation.set(-0.25, -0.3, 0);

	addLocationControls(heroThree.camera, "camera")
		.add(heroThree.camera, "fov")
		.onChange(() => heroThree.camera.updateProjectionMatrix());

	// updateCamera(window.innerWidth);

	// onResizeScreen(({ width }) => {
	// 	updateCamera(width);
	// });

	const hemiLight = new HemisphereLight(0xfefefe, 0x080820, 0.1);
	const sun = new DirectionalLight(0xffffff, 1);
	sun.castShadow = true;
	sun.shadow.radius = 8;

	sun.position.set(0, 1, 0);
	sun.rotation.set(0, 0, 0);
	addLocationControls(sun, "sun");

	const axesHelper = new AxesHelper(1.5);
	const sunHelper = new DirectionalLightHelper(sun, 0.2);
	const hemiHelper = new HemisphereLightHelper(hemiLight, 0.5);

	axesHelper.position.set(-3, 0, -1);

	heroThree.scene.add(sun, hemiLight, hemiHelper, sunHelper, axesHelper);

	heroThree.render();

	return heroThree;
}
