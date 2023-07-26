interface Dimensions {
	width: number;
	height: number;
}
function getScreenDimensions(): Dimensions {
	return { width: window.innerWidth, height: window.innerHeight };
}

function onResizeScreen(handler: (dimensions: Dimensions) => void) {
	const listener = () => {
		handler(getScreenDimensions());
	};
	window.addEventListener("resize", listener);
	return () => window.removeEventListener("resize", listener);
}

export default onResizeScreen;
