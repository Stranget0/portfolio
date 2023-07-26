import {
	playAction,
	handleActionPlay,
	createRepeatable,
	sourceToLoader,
} from "@utils/animation";
import { AnimationMixer, Clock, Mesh } from "three";

export default function startFoxAnimations(root: Mesh) {
	const mixer = new AnimationMixer(root);

	const sources = [
		"foxBlink",
		"foxGrimase",
		"foxHearFront",
		"foxHearRight",
		"foxShakeHead",
		"foxSmile",
		"foxSniff",
	];
	const idleSources = ["foxEarsIdle", "foxFurIdle"];

	const actions = sources.map(sourceToLoader(mixer));
	const idleActions = idleSources.map(
		sourceToLoader(mixer, (a) => {
			a.repetitions = Infinity;
		})
	);

	const [blink, grimase, hearFront, hearRight, shakeHead, smile, sniff] =
		actions;
	const [earsIdle, furIdle] = idleActions;

	const blockGroups = [
		[earsIdle, hearFront, hearRight, shakeHead],
		[grimase, smile],
	];

	// Init
	const clock = new Clock();

	for (const idle of idleActions) {
		idle.load().then(playAction);
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
