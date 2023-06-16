export {};

const elements = document.querySelectorAll<HTMLElement>(
	"[data-static-vh], [data-static-vw]"
);
for (const e of elements) {
	const { staticVh, staticVw, staticVhType, staticVwType } = e.dataset;
	if (staticVh) setStaticViewportSize("Height", e, staticVh, staticVhType);
	if (staticVw) setStaticViewportSize("Width", e, staticVw, staticVwType);
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
	const regexMatch = /\d+v[hw]/g;
	const matches = viewportUnit.match(regexMatch);
	if (!matches) return viewportUnit;
	for (const matchStr of matches) {
		const dimension = matchStr.endsWith("vh")
			? window.innerHeight
			: window.innerWidth;
		const ratio = parseFloat(matchStr) / 100;
		const value = ratio * dimension * window.devicePixelRatio;

		viewportUnit = viewportUnit.replace(matchStr, `${value}px`);
	}
	return viewportUnit;
}
