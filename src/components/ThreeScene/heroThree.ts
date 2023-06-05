import ThreeController from "@utils/ThreeController";
import { threeCanvasId } from "./constants";
import onResizeScreen from "@utils/resizer";

import {
	DirectionalLight,
	HemisphereLight,
	NoToneMapping,
	Vector3,
	Fog,
} from "three";

import initOrbit from "@utils/orbit";

export default function initHeroController() {
	const heroController = new ThreeController(
		`#${threeCanvasId}`,
		window.innerWidth,
		window.innerHeight
	);

	const removeOnResize = onResizeScreen(({ width, height }) => {
		heroController.setSize(width, height);
	});

	heroController.renderer.shadowMap.enabled = true;
	heroController.renderer.toneMapping = NoToneMapping;

	heroController.onDestroy(removeOnResize);

	heroController.camera.position.set(-1, 1, 3);

	const hemiLight = new HemisphereLight(0xfefefe, 0x080820, 0.1);
	const sun = new DirectionalLight(0xffffff, 1);

	sun.position.set(0, 1, 0);
	sun.rotation.set(0, 0, 0);

	const fog = new Fog(0xffffff, 1, 5);

	const cameraTarget = new Vector3(0.5, -0.3, -1);

	heroController.camera.lookAt(cameraTarget);

	initOrbit(heroController, cameraTarget);

	heroController.scene.add(hemiLight, sun);
	heroController.scene.fog = fog;
	heroController.renderer.domElement.classList.add("filter-noise-appear");

	return heroController;
}
