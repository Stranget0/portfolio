import type { AnimationAction, AnimationMixer } from "three";
import randomIntBetween from "./randomIntBetween";
import addSingleEventListener from "./singleEvent";

export function handleActionPlay(
	action: AnimationAction,
	fadeDuration: number,
	idleActions: AnimationAction[],
	blockedBy: AnimationAction[] = [action]
) {
	// Abort when user is out of the tab
	if (document.hidden) return;

	let isActionFadeIn = false;
	let isBlocked = false;
	for (const blockedAction of blockedBy) {
		if (blockedAction.isRunning()) {
			if (idleActions.includes(blockedAction)) isActionFadeIn = true;
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
	actions: AnimationAction[] | AnimationAction,
	fadeDuration: number,
	idleActions: AnimationAction[],
	blockedBy?: AnimationAction[]
) {
	let timeoutId = 0;
	return function play(getRepeatDelay?: () => number, shouldPlay = false) {
		clearTimeout(timeoutId);

		if (shouldPlay) {
			let action;
			if (Array.isArray(actions)) {
				const index = randomIntBetween(0, actions.length - 1);
				action = actions[index];
			} else action = actions;

			handleActionPlay(action, fadeDuration, idleActions, blockedBy);
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
	type HasSameAction = Parameters<
		typeof addSingleEventListener<AnimationMixer>
	>[3];

	const hasSameAction: HasSameAction = (e) => e.action === action;

	return addSingleEventListener(
		action.getMixer(),
		eventName,
		(e) => {
			if (hasSameAction(e)) listener(e);
		},
		hasSameAction
	);
}
