import type ThreeController from "@utils/ThreeController";
import { loadDracoGLTF } from "@utils/loadDracoGLTF";
import type { BufferGeometry, Mesh, MeshStandardMaterial } from "three";

export default function loadFox(controller: ThreeController) {
	const fox = loadDracoGLTF("models/fox/foxM.glb").then((foxGLTF) => {
		const fox = foxGLTF.scene as Mesh<BufferGeometry, MeshStandardMaterial>;
		fox.matrixAutoUpdate = false;
		fox.receiveShadow = true;
		fox.castShadow = true;

		controller.scene.add(fox);
		controller.render();
		return fox;
	});

	const foxAnimations = fox.then(async (fox) => {
		const animationManager = await Promise.all([
			loadDracoGLTF("models/fox/foxAnimations.glb"),
			import("./foxAnimations"),
		]).then(([{ animations }, { default: startFoxAnimations }]) =>
			startFoxAnimations(fox, animations)
		);

		const { animations } = animationManager;
		const blinkDuration = animations.blink.getClip().duration * 1000;
		const sniffDuration = animations.sniff.getClip().duration * 1000;
		animationManager.blink(() => Math.random() * 10000 + blinkDuration);
		animationManager.sniff(() => Math.random() * 10000 + sniffDuration);
		animationManager.attention(() => Math.random() * 20000 + 10000);
		animationManager.shakeHead();

		controller.frameListeners.push(() => animationManager.update());
	});

	return { fox, foxAnimations };
}
