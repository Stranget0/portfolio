export {};

const elements = document.querySelectorAll<HTMLElement>(
	"[data-static-w], [data-static-h]"
);

updateElements();

function updateElements() {
	for (const e of elements) {
		const { staticH, staticW, staticHType, staticWType } = e.dataset;
		if (staticH) setStaticViewportSize("Height", e, staticH, staticHType);
		if (staticW) setStaticViewportSize("Width", e, staticW, staticWType);
	}
}

function setStaticViewportSize(
	dimension: "Height" | "Width",
	e: HTMLElement,
	viewportUnit: string,
	vhType: string | undefined
) {
	const value = parseViewportUnit(viewportUnit);
	switch (vhType) {
		case "min":
			e.style[`min${dimension}`] = value;
			break;
		case "max":
			e.style[`max${dimension}`] = value;
			break;
		default: {
			const typeL = dimension.toLowerCase() as Lowercase<typeof dimension>;
			e.style[typeL] = value;
		}
	}
}

function parseViewportUnit(viewportUnit: string) {
	const isRotated = screen?.orientation?.angle > 0;

	const screenSizes = [window.innerWidth, window.innerHeight];
	const regexMatch = /\d+v[hw]/g;
	const matches = viewportUnit.match(regexMatch);

	if (!matches) return viewportUnit;

	if (isRotated) screenSizes.reverse();

	for (const matchStr of matches) {
		const dimension = matchStr.endsWith("vh") ? screenSizes[1] : screenSizes[0];
		const ratio = parseFloat(matchStr) / 100;

		const value = ratio * dimension;

		viewportUnit = viewportUnit.replace(matchStr, `${value}px`);
	}
	return viewportUnit;
}
