import {
	stopAction,
	playAction,
	handleActionPlay,
	createRepeatable,
} from "@utils/animation";
import {
	AnimationAction,
	AnimationClip,
	AnimationMixer,
	Clock,
	LoopRepeat,
	Mesh,
} from "three";

export default function startFoxAnimations(root: Mesh, clips: AnimationClip[]) {
	const mixer = new AnimationMixer(root);
	const actions = clips.map((a: AnimationClip) => {
		const clipped = mixer.clipAction(a);
		clipped.loop = LoopRepeat;
		clipped.repetitions = 1;
		stopAction(clipped);
		return clipped;
	}) as AnimationAction[];

	const [
		blink,
		earsIdle,
		furIdle,
		grimase,
		hearFront,
		hearRight,
		shakeHead,
		smile,
		sniff,
	] = actions;

	[furIdle, earsIdle].forEach((a) => {
		a.repetitions = Infinity;
	});

	const idleActions = [earsIdle, furIdle];
	const blockGroups = [
		[earsIdle, hearFront, hearRight],
		[grimase, smile],
	];

	// Init
	const clock = new Clock();

	for (const idle of idleActions) {
		playAction(idle);
		const blockedBy = blockGroups.find((g) => g.includes(idle));
		if (!blockedBy) continue;

		const idleBlockGroup = blockedBy.filter((a) => a !== earsIdle);
		mixer.addEventListener("finished", (e) => {
			if (idleBlockGroup.includes(e.action)) {
				handleActionPlay(earsIdle, 1.5, idleActions, blockGroups[0]);
			}
		});
	}

	const animations = {
		blink,
		earsIdle,
		furIdle,
		grimase,
		hearFront,
		hearRight,
		shakeHead,
		smile,
		sniff,
	};

	const animationManager = {
		animations,
		update() {
			mixer.update(clock.getDelta());
		},
		attention: createRepeatable(
			[hearRight, hearFront],
			0.2,
			idleActions,
			blockGroups[0]
		),
		blink: createRepeatable(blink, 0.1, idleActions),
		sniff: createRepeatable(sniff, 0.1, idleActions),
		smile() {
			handleActionPlay(smile, 1, idleActions, blockGroups[1]);
		},
		shakeHead() {
			handleActionPlay(shakeHead, 0.5, idleActions);
		},
	};

	return animationManager;
}
