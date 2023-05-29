export async function init() {
	const onAnimates: VoidFunction[] = [];

	const heroThree = import("./heroThree").then(
		({ default: initHeroController }) => {
			return initHeroController();
		}
	);

	const fox = import("./models/fox").then(async ({ default: loadFox }) => {
		const [fox, foxAnims] = await loadFox();
		onAnimates.push(() => foxAnims.update());
		const controller = await heroThree;
		controller.scene.add(fox);
	});

	const leaves = import("./models/leaves").then(
		async ({ default: loadLeaves }) => {
			const leaves = await loadLeaves(30, 1, 2, 3);
			const controller = await heroThree;
			controller.scene.add(...leaves);
		}
	);

	const [controller] = await Promise.all([heroThree, fox, leaves]);

	function animate() {
		requestAnimationFrame(animate);
		controller.render();
		onAnimates.forEach((f) => f());
	}
	animate();
}
