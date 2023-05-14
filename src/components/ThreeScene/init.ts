import { loadDracoGLTF } from "@utils/loadDracoGLTF";

export async function init() {
	const [{ default: initHeroController }, foxGLTF] = await Promise.all([
		import("./heroThree"),
		loadDracoGLTF("models/fox/foxDraco.glb"),
	]);

	const heroController = initHeroController();
	heroController.scene.add(foxGLTF);
	heroController.render();
}
