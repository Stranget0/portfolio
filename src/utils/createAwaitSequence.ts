export function createAwaitSequence() {
	let isCanceled = false;

	async function runAwaitSequence<T>(
		group: T[],
		sequenceAwait: (el: T) => Promise<unknown>
	) {
		for (
			let groupIndex = 0;
			groupIndex < group.length && !isCanceled;
			groupIndex++
		) {
			await sequenceAwait(group[groupIndex]);
		}
	}
	return {
		cancel() {
			isCanceled = true;
		},
		runSequence: runAwaitSequence,
	};
}
