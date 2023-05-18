import { addLocationControls } from "@utils/gui";
import { loadDracoGLTF } from "@utils/loadDracoGLTF";
import { ShaderMaterial } from "three";

export async function init() {
	const [{ default: initHeroController }, fox] = await Promise.all([
		import("./heroThree"),
		loadDracoGLTF("models/fox/foxNoAnimsDraco.glb"),
	]);

	fox.receiveShadow = true;
	fox.castShadow = true;

	const heroController = initHeroController();
	heroController.scene.add(fox);
	heroController.render();
	heroController.renderer.domElement.classList.add("filter-noise-appear");

	(fox as any).material = new ShaderMaterial({
		uniforms: {
			control: { value: heroController.camera.position },
		},
	});

	addLocationControls(fox, "fox");

	function animate() {
		heroController.render();
		requestAnimationFrame(animate);
	}
	animate();
}
