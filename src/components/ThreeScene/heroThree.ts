import ThreeController from "@utils/ThreeController";
import { threeCanvasId } from "./constants";
import onResizeScreen from "@utils/resizer";

import {
	DirectionalLight,
	HemisphereLight,
	Vector3,
	Fog,
	ACESFilmicToneMapping,
	VSMShadowMap,
	PerspectiveCamera,
} from "three";

import initOrbit from "@utils/orbit";

export default function initHeroController() {
	const camera = new PerspectiveCamera(
		70,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.set(-1, 1, 3);
	const cameraTarget = new Vector3(0.5, -0.3, -1);
	camera.lookAt(cameraTarget);

	const heroController = new ThreeController(
		`#${threeCanvasId}`,
		window.innerWidth,
		window.innerHeight,
		camera
	);
	heroController.renderer.toneMapping = ACESFilmicToneMapping;
	heroController.renderer.toneMappingExposure = 2;
	heroController.renderer.shadowMap.type = VSMShadowMap;

	const removeOnResize = onResizeScreen(({ width, height }) => {
		heroController.setSize(width, height);
	});

	heroController.onDestroy(removeOnResize);

	const hemiLight = new HemisphereLight(0xfefefe, 0x080000, 0.8);
	const mainLight = new DirectionalLight(0xffffff, 1);
	const subLight1 = new DirectionalLight(0xffffff, 0.5);
	[mainLight, subLight1].forEach((l) => {
		l.castShadow = true;
		l.shadow.mapSize.width = 128;
		l.shadow.mapSize.height = 128;
	});
	mainLight.position.set(-1, 1, 0);
	subLight1.position.set(-1, 1, 3);

	const fog = new Fog(0xffffff, 2.5, 5);

	initOrbit(heroController, cameraTarget);
	heroController.scene.add(mainLight, hemiLight, subLight1);
	heroController.scene.fog = fog;

	return heroController;
}
