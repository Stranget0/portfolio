export type Target = HTMLElement | Document | Window;

export default function addSingleEventListener(
	target: Target,
	eventName: string,
	listener: EventListener
) {
	const handleEvent = (e: Event): void => {
		clean();
		listener(e);
	};

	target.addEventListener(eventName, handleEvent);

	function clean() {
		target.removeEventListener(eventName, handleEvent);
	}
	return clean;
}
