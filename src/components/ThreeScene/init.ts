import { addLocationControls } from "@utils/gui";
import { loadDracoGLTF } from "@utils/loadDracoGLTF";

export async function init() {
	const [{ default: initHeroController }, fox] = await Promise.all([
		import("./heroThree"),
		loadDracoGLTF("models/fox/foxNoAnimsDraco.glb"),
	]);

	fox.receiveShadow = true;
	fox.castShadow = true;

	fox.customDepthMaterial;

	const heroController = initHeroController();
	heroController.scene.add(fox);
	heroController.render();
	heroController.renderer.domElement.classList.add("filter-noise-appear");

	addLocationControls(fox, "fox");

	function animate() {
		heroController.render();
		requestAnimationFrame(animate);
	}
	animate();
}
