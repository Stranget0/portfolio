import { foxObstacleAttr } from "./constants";
import type { FoxControllerType } from "./foxController";
const selector = `[${foxObstacleAttr}]`;

let foxPromise: null | Promise<FoxControllerType> = null;

const observer = new IntersectionObserver(
	(entries) => {
		if (!entries.some(({ isIntersecting }) => isIntersecting)) load();
	},
	{ rootMargin: `${-window.innerHeight / 1.1}px 0px 0px 0px`, root: null }
);

for (const obstacle of document.querySelectorAll<HTMLElement>(selector)) {
	observer.observe(obstacle);
}

function load() {
	observer.disconnect();
	foxPromise = import("./foxController").then(({ default: d }) => d);
}

export default function getFoxController() {
	return foxPromise;
}
