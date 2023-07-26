export default function wait(handler: VoidFunction, ms = 0) {
	let timeoutId = -1;
	const finished = new Promise<void>((resolve) => {
		timeoutId = window.setTimeout(async () => {
			await handler();
			resolve();
		}, ms);
	});

	return {
		finished,
		cancel() {
			clearTimeout(timeoutId);
		},
	};
}
