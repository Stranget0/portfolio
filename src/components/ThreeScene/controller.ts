import type ThreeController from "@utils/ThreeController";
import { inView } from "motion";
export {};

const onAnimates: VoidFunction[] = [];
const heroThree = import("./heroThree").then(
	({ default: initHeroController }) => {
		return initHeroController();
	}
);

export const fox = import("./models/fox").then(async ({ default: loadFox }) => {
	const [fox, animationController] = await loadFox();
	animationController.then((animationManager) => {
		const { animations } = animationManager;
		const blinkDuration = animations.blink.getClip().duration * 1000;
		const sniffDuration = animations.sniff.getClip().duration * 1000;
		animationManager.blink(() => Math.random() * 10000 + blinkDuration);
		animationManager.sniff(() => Math.random() * 10000 + sniffDuration);
		animationManager.attention(() => Math.random() * 20000 + 10000);
		animationManager.shakeHead();

		onAnimates.push(() => animationManager.update());
	});
	const controller = await heroThree;
	controller.scene.add(fox);
	return animationController;
});

const leaves = import("./models/leaves").then(
	async ({ default: loadLeaves }) => {
		const leaves = await loadLeaves(30, 1, 2, 3);
		const controller = await heroThree;
		controller.scene.add(...leaves);
	}
);

const controller = await heroThree;
let frameId = -1;
animate(controller, onAnimates);

await Promise.all([fox, leaves]);
controller.renderer.domElement.classList.remove("opacity-0");

function animate(controller: ThreeController, onAnimates: VoidFunction[]) {
	frameId = requestAnimationFrame(() => animate(controller, onAnimates));
	controller.render();
	onAnimates.forEach((f) => f());
}

inView("[data-obstacle-fox]", () => {
	cancelAnimationFrame(frameId);
	return () => {
		if (controller) animate(controller, onAnimates);
	};
});
