export default function handleClickOutside(
	element: HTMLElement,
	handler: (e: Event) => void
) {
	window.addEventListener("click", listener);
	window.addEventListener("touchend", listener);

	return clear;

	function listener(e: Event) {
		if (!e.target || !element.contains(e.target as Node)) {
			handler(e);
			clear();
		}
	}

	function clear() {
		window.removeEventListener("click", listener);
		window.removeEventListener("touchend", listener);
	}
}
