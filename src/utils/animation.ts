import {
	LoopRepeat,
	type AnimationAction,
	type AnimationClip,
	type AnimationMixer,
} from "three";
import randomIntBetween from "./randomIntBetween";
import addSingleEventListener from "./singleEvent";
import { loadDracoGLTF } from "./loadDracoGLTF";

export type ActionLoader = {
	action: null | AnimationAction;
	load: () => Promise<AnimationAction>;
};

type Animation = AnimationAction | ActionLoader;

export async function handleActionPlay<T extends Animation>(
	actionOrActionLoader: T,
	fadeDuration: number,
	idleActionsOrLoaders: T[],
	blockedBy: T[] = [actionOrActionLoader]
) {
	// Abort when user is out of the tab
	if (document.hidden) return;

	let action: AnimationAction;
	if ("load" in actionOrActionLoader)
		action = await actionOrActionLoader.load();
	else action = actionOrActionLoader;

	let isActionFadeIn = false;
	let isBlocked = false;
	for (const blockedActionOrLoader of blockedBy) {
		const blockedAction = getAction(blockedActionOrLoader);
		if (blockedAction?.isRunning()) {
			if (idleActionsOrLoaders.includes(blockedActionOrLoader))
				isActionFadeIn = true;

			if (blockedAction === action) isBlocked = true;
			blockedAction.fadeOut(fadeDuration);

			if (!isActionFadeIn) {
				addSingleListenerForAction(blockedAction, "loop", () =>
					playAction(action)
				);
			}
		}
	}
	if (isBlocked) return;
	playAction(action);
	if (isActionFadeIn) action.fadeIn(fadeDuration);
}

export function createRepeatable(
	actionsOrLoaders: Animation[] | Animation,
	fadeDuration: number,
	idleActionsOrLoaders: Animation[],
	blockedBy?: Animation[]
) {
	let timeoutId = 0;
	return function play(getRepeatDelay?: () => number, shouldPlay = false) {
		clearTimeout(timeoutId);

		if (shouldPlay) {
			let actionOrLoader;
			if (Array.isArray(actionsOrLoaders)) {
				const index = randomIntBetween(0, actionsOrLoaders.length - 1);
				actionOrLoader = actionsOrLoaders[index];
			} else actionOrLoader = actionsOrLoaders;

			handleActionPlay(
				actionOrLoader,
				fadeDuration,
				idleActionsOrLoaders,
				blockedBy
			);
		}
		if (getRepeatDelay)
			timeoutId = window.setTimeout(
				() => play(getRepeatDelay, true),
				getRepeatDelay()
			);
	};
}

export function playAction(action: AnimationAction) {
	action.time = 0;
	setWeight(action, 1);
	action.play();
}

export function setWeight(action: AnimationAction, weight: number) {
	action.enabled = true;
	action.setEffectiveTimeScale(1);
	action.setEffectiveWeight(weight);
}

export function stopAction(clipped: AnimationAction) {
	clipped.setEffectiveWeight(0);
	clipped.stop();
}

export function addSingleListenerForAction(
	action: AnimationAction,
	eventName: string,
	listener: Parameters<AnimationMixer["addEventListener"]>[1]
) {
	type EventType = Parameters<typeof listener>[0];

	const hasSameAction = (e: EventType) => e.action === action;

	return addSingleEventListener(
		action.getMixer(),
		eventName,
		(e: EventType) => {
			if (hasSameAction(e)) listener(e);
		},
		hasSameAction
	);
}

export function sourceToLoader(
	mixer: AnimationMixer,
	onLoad?: (action: AnimationAction) => void
): (value: string) => ActionLoader {
	return (source) => {
		return {
			action: null,
			async load() {
				if (this.action) return this.action;
				const { animations } = await loadDracoGLTF(
					`models/fox/individualAnimations/${source}.glb`
				);
				const clip: AnimationClip = animations[0];
				const clipped = mixer.clipAction(clip);
				clipped.loop = LoopRepeat;
				clipped.repetitions = 1;
				stopAction(clipped);
				onLoad?.(clipped);
				this.action = clipped;
				return clipped;
			},
		};
	};
}

function getAction(actionOrActionLoader: Animation) {
	return "action" in actionOrActionLoader
		? actionOrActionLoader.action
		: actionOrActionLoader;
}

export function getActionDuration(a: AnimationAction): number {
	return a.getClip().duration * 1000;
}
