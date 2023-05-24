import loadFox from "./models/fox";
import loadLeafs from "./models/leaves";
export async function init() {
	const [initHeroController, fox, leaves] = await Promise.all([
		import("./heroThree").then(({ default: d }) => d),
		loadFox(),
		loadLeafs(30, 1, 2, 3),
	]);
	const heroController = initHeroController();
	heroController.scene.add(fox, ...leaves);
	heroController.render();
}
