export function createAwaitSequence() {
	let isCanceled = false;

	async function runAwaitSequence<T>(
		sequence: T[],
		sequenceAwait: (el: T, i: number) => Promise<unknown>,
	) {
		isCanceled = false;
		for (
			let groupIndex = 0;
			groupIndex < sequence.length && !isCanceled;
			groupIndex++
		) {
			await sequenceAwait(sequence[groupIndex], groupIndex);
		}
	}
	return {
		cancel() {
			isCanceled = true;
		},
		runSequence: runAwaitSequence,
	};
}
