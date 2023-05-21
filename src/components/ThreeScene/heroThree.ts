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
	Vector3,
} from "three";
import initOrbit from "@utils/orbit";

// import { addLocationControls } from "@utils/gui";

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

	heroThree.onDestroy(removeOnResize);

	heroThree.camera.position.set(-1, 1, 3);

	const hemiLight = new HemisphereLight(0xfefefe, 0x080820, 0.1);
	const sun = new DirectionalLight(0xffffff, 1);
	sun.castShadow = true;
	sun.shadow.radius = 8;

	sun.position.set(0, 1, 0);
	sun.rotation.set(0, 0, 0);

	const cameraTarget = new Vector3(-0.15, 0.3, 1);
	const sunHelper = new DirectionalLightHelper(sun, 0.2);
	const hemiHelper = new HemisphereLightHelper(hemiLight, 0.5);
	const targetHelper = new AxesHelper(1);
	targetHelper.position.copy(cameraTarget);

	heroThree.camera.lookAt(cameraTarget);

	initOrbit(heroThree, cameraTarget);

	heroThree.scene.add(sun, hemiLight, hemiHelper, sunHelper, targetHelper);
	heroThree.render();

	return heroThree;
}
