import ThreeController from "@utils/ThreeController";
import { threeCanvasId } from "./constants";
import onResizeScreen from "@utils/resizer";

import { DirectionalLight, HemisphereLight, Vector3, Fog } from "three";

import initOrbit from "@utils/orbit";
import gui from "@utils/gui";

export default function initHeroController() {
	const heroController = new ThreeController(
		`#${threeCanvasId}`,
		window.innerWidth,
		window.innerHeight
	);

	const removeOnResize = onResizeScreen(({ width, height }) => {
		heroController.setSize(width, height);
	});
	heroController.camera.fov = 10;
	// heroController.renderer.toneMapping = ReinhardToneMapping;

	heroController.onDestroy(removeOnResize);

	heroController.camera.position.set(-1, 1, 3);

	const hemiLight = new HemisphereLight(0xfefefe, 0x080000, 0.3);
	const sun = new DirectionalLight(0xffffff, 1);

	sun.castShadow = true;
	sun.position.set(0, 1, 0);
	sun.rotation.set(0, 0, 0);

	const lightGUI = gui.addFolder("light");
	lightGUI
		.add(sun.shadow, "radius", 0)
		.onChange((v) => (sun.shadow.radius = v));
	lightGUI
		.add(sun.shadow, "blurSamples", 0)
		.onChange((v) => (sun.shadow.blurSamples = v));

	const fog = new Fog(0xffffff, 1, 10);

	const cameraTarget = new Vector3(0.5, -0.3, -1);

	heroController.camera.lookAt(cameraTarget);

	initOrbit(heroController, cameraTarget);
	heroController.scene.add(sun, hemiLight);
	// heroController.scene.fog = fog;

	return heroController;
}
