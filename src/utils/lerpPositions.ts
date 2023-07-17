export interface LerpObject<T = unknown> {
	distanceTo(target: T): number;
	lerp(target: T, alpha: number): T;
}

export default function initLerpPositions(
	onUpdate: VoidFunction,
	EPS = 0.0001
) {
	let frameId = -1;
	let isRunning = false;

	function lerpPositions<T>(
		from: LerpObject<T>,
		to: T,
		alpha: number,
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
			onUpdate();
			lerpPositions(from, to, alpha, localEPS, onFinish);
		});
	}

	function startLerp<T>(
		from: LerpObject<T>,
		to: T,
		alpha = 0.1,
		localEPS = EPS,
		onFinish?: VoidFunction
	) {
		cancel();
		isRunning = true;
		lerpPositions(from, to, alpha, localEPS, onFinish);
	}

	function cancel() {
		isRunning = false;
		cancelAnimationFrame(frameId);
	}

	return {
		cancel,
		startLerp,
		isRunning: () => isRunning,
	};
}
