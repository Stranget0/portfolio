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

	function lerpPositions<T>(from: LerpObject<T>, to: T, alpha: number) {
		const distance = from.distanceTo(to);
		if (distance < EPS) {
			isRunning = false;
			return;
		}
		frameId = requestAnimationFrame(() => {
			from.lerp(to, alpha);
			onUpdate();
			lerpPositions(from, to, alpha);
		});
	}

	function startLerp<T>(from: LerpObject<T>, to: T, alpha = 0.1) {
		cancel();
		isRunning = true;
		lerpPositions(from, to, alpha);
	}

	function cancel() {
		cancelAnimationFrame(frameId);
	}

	return {
		cancel,
		startLerp,
		isRunning() {
			return isRunning;
		},
	};
}
