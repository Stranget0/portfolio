import { addLocationControls } from "@utils/gui";
import { loadDracoGLTF } from "@utils/loadDracoGLTF";

export async function init() {
	const [{ default: initHeroController }, foxGLTF] = await Promise.all([
		import("./heroThree"),
		loadDracoGLTF("models/fox/foxNoAnimsDraco.glb"),
	]);

	foxGLTF.receiveShadow = true;
	foxGLTF.castShadow = true;

	const heroController = initHeroController();
	heroController.scene.add(foxGLTF);
	heroController.render();
	heroController.renderer.domElement.classList.add("filter-noise-appear");

	addLocationControls(foxGLTF, "fox");

	function animate() {
		heroController.render();
		requestAnimationFrame(animate);
	}
	animate();
}
