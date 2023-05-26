export interface LerpObject<T = unknown> {
	distanceTo(target: T): number;
	lerp(target: T, alpha: number): T;
}

export default function initLerpPositions(onUpdate: VoidFunction) {
	let frameId = -1;

	function lerpPositions<T>(from: LerpObject<T>, to: T) {
		const distance = from.distanceTo(to);
		if (distance < 0.0001) return;
		frameId = requestAnimationFrame(() => {
			from.lerp(to, 0.1);
			onUpdate();
			lerpPositions(from, to);
		});
	}

	function startLerp<T>(from: LerpObject<T>, to: T) {
		cancel();
		lerpPositions(from, to);
	}

	function cancel() {
		cancelAnimationFrame(frameId);
	}

	return { cancel, startLerp };
}
