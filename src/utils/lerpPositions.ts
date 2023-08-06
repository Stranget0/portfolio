export interface LerpObject<T = unknown> {
	distanceTo(target: T | LerpObject<T>): number;
	lerp(target: T | LerpObject<T>, alpha: number): T;
	clone(): LerpObject<T>;
}

export default function initLerpPositions(
	onUpdate: VoidFunction,
	EPS = 0.0001
) {
	let frameId = -1;
	let isRunning = false;
	let onCancel: VoidFunction | null | undefined = null;

	function lerpPositions<T>(
		from: LerpObject<T>,
		to: T | LerpObject<T>,
		alpha: number,
		last: LerpObject<T>,
		localEPS: number,
		onFinish?: VoidFunction
	) {
		const distance = from.distanceTo(to);
		if (distance < localEPS) {
			onFinish?.();
			isRunning = false;
			return;
		}
		frameId = requestAnimationFrame(() => {
			from.lerp(to, alpha);
			if (last.distanceTo(from) >= EPS) onUpdate();
			lerpPositions(from, to, alpha, last, localEPS, onFinish);
		});
	}

	function startLerp<T>(
		from: LerpObject<T>,
		to: T | LerpObject<T>,
		alpha = 0.1,
		localEPS = EPS,
		onFinish?: VoidFunction
	) {
		cancel();
		isRunning = true;
		onCancel = onFinish;
		const last = from.clone();
		lerpPositions(from, to, alpha, last, localEPS, onFinish);
	}

	function cancel() {
		isRunning = false;
		onCancel?.();
		cancelAnimationFrame(frameId);
	}

	return {
		cancel,
		startLerp,
		isRunning: () => isRunning,
	};
}
