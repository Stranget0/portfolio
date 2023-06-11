import addSingleEventListener from "./singleEvent";

export function onScrollbar(
	onUpdate: (isActive: boolean) => void
): VoidFunction {
	window.addEventListener("mousedown", onMouseDown);
	window.addEventListener("mouseup", onMouseUp);

	let isActive = false;
	function onMouseDown(e: MouseEvent) {
		if (!e.target || e.button !== 0) return;
		const target = e.target as HTMLElement;
		if (e.offsetX > target.clientWidth || e.offsetY > target.clientHeight) {
			isActive = true;
			onUpdate(isActive);
		}
	}

	function onMouseUp(e: MouseEvent) {
		if (!isActive || e.button !== 0) return;
		isActive = false;
		onUpdate(isActive);
	}

	return () => {
		window.removeEventListener("mousedown", onMouseDown);
		window.removeEventListener("mouseup", onMouseUp);
	};
}

export function onMiddleButtonScroll(onUpdate: (isActive: boolean) => void) {
	let isMiddleButtonScroll = false;

	let timeoutId = -1;

	window.addEventListener("mousedown", onMouseDown);
	const cleanTuple = [
		() => window.removeEventListener("mousedown", onMouseDown),
	];

	function checkIsMiddleButton(e: MouseEvent): boolean {
		return e.button === 1;
	}

	function switchState(state: boolean) {
		isMiddleButtonScroll = state;
		onUpdate(state);
	}

	function onMouseDown(e: MouseEvent) {
		if (!checkIsMiddleButton(e)) return;
		clearTimeout(timeoutId);
		switchState(!isMiddleButtonScroll);

		if (!isMiddleButtonScroll) return;

		// Change mode to hold and release
		timeoutId = window.setTimeout(() => {
			const clean = offOnMouseUp();
			set2ndCleanFunction(clean);
		}, 100);

		function offOnMouseUp() {
			return addSingleEventListener(
				window,
				"mouseup",
				(e) => {
					if (!checkIsMiddleButton(e)) return;
					switchState(false);
				},
				checkIsMiddleButton
			);
		}
	}

	function set2ndCleanFunction(clean: () => void) {
		cleanTuple[1] = () => {
			clean();
			cleanTuple.pop();
		};
	}

	function clean() {
		while (cleanTuple.length) {
			cleanTuple.pop()?.();
		}
	}

	return clean;
}
