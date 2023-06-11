type EventHandler<E> = (e: E) => void;
type EventListener<E> = (e: string, handler: EventHandler<E>) => void;
type Target<E> = {
	addEventListener: EventListener<E>;
	removeEventListener: EventListener<E>;
};

export default function addSingleEventListener<T extends Target<E>, E>(
	target: T,
	eventName: string,
	listener: (e: E) => void,
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
