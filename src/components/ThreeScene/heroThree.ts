import ThreeController from "@utils/ThreeController";
import { threeCanvasId } from "./constants";
import onResizeScreen from "@utils/resizer";

export default function heroThreeInit() {
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
	return heroThree;
}
