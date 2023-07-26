import type ThreeController from "@utils/ThreeController";
import { getActionDuration } from "@utils/animation";
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
		const animationManager = await import("./foxAnimations").then(
			({ default: startFoxAnimations }) => startFoxAnimations(fox)
		);

		const { animations } = animationManager;

		animations.blink.load().then((a) => {
			const blinkDuration = getActionDuration(a);
			animationManager.blink(() => Math.random() * 10000 + blinkDuration);
		});
		animations.sniff.load().then((a) => {
			const sniffDuration = a.getClip().duration * 1000;
			animationManager.sniff(() => Math.random() * 10000 + sniffDuration);
		});
		animationManager.attention(() => Math.random() * 20000 + 10000);
		animationManager.shakeHead();

		controller.frameListeners.push(() => animationManager.update());

		return animationManager;
	});

	return { fox, foxAnimations };
}
