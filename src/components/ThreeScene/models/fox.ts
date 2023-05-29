import { loadDracoGLTF } from "@utils/loadDracoGLTF";
import {
	AnimationAction,
	AnimationClip,
	AnimationMixer,
	Clock,
	LoopOnce,
	LoopRepeat,
} from "three";

export default async function loadFox() {
	const [foxGltf, animsGLTF] = await Promise.all([
		loadDracoGLTF("models/fox/foxLowNoAnimsDraco.glb"),
		loadDracoGLTF("models/fox/foxAnimations.glb"),
	]);

	const fox = foxGltf.scene;

	fox.receiveShadow = true;
	fox.castShadow = true;

	const mixer = new AnimationMixer(fox);
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
	] = animsGLTF.animations.map((a: AnimationClip) => {
		const clipped = mixer.clipAction(a);
		clipped.loop = LoopOnce;
		return clipped;
	}) as AnimationAction[];

	[furIdle, earsIdle].forEach((clip) => {
		clip.loop = LoopRepeat;
	});

	// [blink, furIdle, earsIdle, smile, sniff, grimase].forEach((a) => {
	// 	a.blendMode = AdditiveAnimationBlendMode;
	// });

	const blockGroups = [
		[earsIdle, hearFront, hearRight],
		[grimase, smile],
	];

	// Init
	const clock = new Clock();

	const animationManager = {
		_blinkTimeout: -1,
		attention(
			direction: "front" | "right" = Math.random() > 0.5 ? "front" : "right"
		) {
			const attentionAction = direction === "front" ? hearFront : hearRight;
			handleAction(attentionAction, 150, blockGroups[0]);
		},
		smile() {
			handleAction(smile, 100, blockGroups[1]);
		},
		update() {
			mixer.update(clock.getDelta());
		},
		blink(repeatDelay?: number) {
			clearTimeout(this._blinkTimeout);
			handleAction(blink, 10);
			if (repeatDelay)
				this._blinkTimeout = window.setTimeout(
					() => this.blink(repeatDelay),
					repeatDelay
				);
		},
	};

	furIdle.play();
	earsIdle.play();
	smile.play();

	return [fox, animationManager] as const;
}

function handleAction(
	action: AnimationAction,
	fadeDuration: number,
	blockedBy: AnimationAction[] = [action]
) {
	action.time = 0;
	let hasBeenBlocked = false;
	for (const blockedAction of blockedBy) {
		if (blockedAction.isRunning()) {
			hasBeenBlocked = true;
			blockedAction.crossFadeTo(action, fadeDuration, false);
		}
	}
	if (!hasBeenBlocked) {
		action.play();
	}
}
