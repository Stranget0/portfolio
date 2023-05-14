import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import ThreeController from "@utils/ThreeController";
import { threeCanvasId } from "./constants";
import onResizeScreen from "@utils/resizer";
import type { Object3D } from "three";

function updateCamera(width: number) {
	const newX = (2 * width) / 1000;
	heroThree.camera.position.setX(newX);
	heroThree.render();
}

const heroThree = new ThreeController(
	`#${threeCanvasId}`,
	window.innerWidth,
	window.innerHeight
);

const removeOnResize = onResizeScreen(({ width, height }) => {
	heroThree.setSize(width, height);
});

heroThree.onDestroy(removeOnResize);

heroThree.camera.position.setZ(5);

updateCamera(window.innerWidth);

onResizeScreen(({ width }) => {
	updateCamera(width);
});

const gltfLoader = new GLTFLoader();

gltfLoader.load("models/fox/fox.glb", (fox: { scene: Object3D }) => {
	const foxObject = fox.scene;
	foxObject.rotateZ(-Math.PI / 30);
	foxObject.rotateY(Math.PI / 2.5);
	heroThree.scene.add(foxObject);
	heroThree.render();
});

heroThree.render();
