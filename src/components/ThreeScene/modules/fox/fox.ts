import type ThreeController from "@utils/ThreeController";
import { getActionDuration } from "@utils/animation";
import { loadDracoGLTF } from "@utils/loadDracoGLTF";
import type { BufferGeometry, Mesh, MeshStandardMaterial } from "three";

export default function loadFox(controller: ThreeController) {
	const fox = loadDracoGLTF("models/fox/foxLow.glb")
		.then((foxGLTF) => {
			const fox = foxGLTF.scene as Mesh<BufferGeometry, MeshStandardMaterial>;
			fox.matrixAutoUpdate = false;

			controller.scene.add(fox);
			controller.render();
			return fox;
		})
		.catch(console.error);

	const foxAnimations = fox
		.then(async (fox) => {
			if (!fox) return;
			const animationManager = await import("./foxAnimations")
				.then(({ default: startFoxAnimations }) => startFoxAnimations(fox))
				.catch(console.error);

			if (!animationManager) return;

			const { animations } = animationManager;

			animations.blink
				.load()
				.then((a) => {
					const blinkDuration = getActionDuration(a);
					animationManager.blink(() => Math.random() * 10000 + blinkDuration);
				})
				.catch(console.error);
			animations.sniff
				.load()
				.then((a) => {
					const sniffDuration = a.getClip().duration * 1000;
					animationManager.sniff(() => Math.random() * 10000 + sniffDuration);
				})
				.catch(console.error);

			animationManager.attention(() => Math.random() * 20000 + 10000);
			animationManager.shakeHead();

			controller.frameListeners.push(() => animationManager.update());

			return animationManager;
		})
		.catch(console.error);

	return { fox, foxAnimations };
}
