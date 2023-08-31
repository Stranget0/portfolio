import type ThreeController from "@utils/ThreeController";
import { HemisphereLight, DirectionalLight } from "three";

export default function initLights(controller: ThreeController) {
	const hemiLight = new HemisphereLight(0xfefefe, 0x080000, 0.8);
	const mainLight = new DirectionalLight(0xffffff, 1);
	const subLight1 = new DirectionalLight(0xffffff, 0.5);

	mainLight.position.set(-1, 1, 0);
	subLight1.position.set(-1, 1, 3);
	controller.scene.add(mainLight, hemiLight, subLight1);
	controller.render();
}
