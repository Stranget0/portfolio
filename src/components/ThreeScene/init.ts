import { Clock } from "three";
import loadFox from "./models/fox";
import loadLeafs from "./models/leaves";
export async function init() {
	const [initHeroController, [fox, foxAnims], leaves] = await Promise.all([
		import("./heroThree").then(({ default: d }) => d),
		loadFox(),
		loadLeafs(30, 1, 2, 3),
	]);
	const heroController = initHeroController();
	heroController.scene.add(fox, ...leaves);

	const clock = new Clock();
	function animate() {
		requestAnimationFrame(animate);
		heroController.render();
		foxAnims.update(clock.getDelta());
	}
	animate();
}
