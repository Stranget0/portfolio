type Handler<E> = (e: E) => any;
type EventListener<E = unknown> = (name: string, handler: Handler<E>) => any;
type Target = {
	addEventListener: EventListener;
	removeEventListener: EventListener;
};

export default function addSingleEventListener<T extends Target>(
	target: T,
	eventName: string,
	listener: Handler<Parameters<Parameters<T["addEventListener"]>[1]>[0]>,
	shouldClean: (e: Parameters<typeof listener>[0]) => boolean = () => true
) {
	const handleEvent: typeof listener = (e) => {
		if (shouldClean(e)) clean();
		listener(e);
	};

	target.addEventListener(eventName, handleEvent);

	function clean() {
		target.removeEventListener(eventName, handleEvent);
	}
	return clean;
}
